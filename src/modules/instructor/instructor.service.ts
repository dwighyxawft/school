import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { PrismaService } from 'database/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class InstructorService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailerService,
    private jwtService: JwtService
  ) {}
  public async register(instructor: CreateInstructorDto) {
    const checkMail = await this.getInstructorByEmail(instructor.email);
    if (checkMail)
      throw new HttpException('Instructor already exists', HttpStatus.FORBIDDEN);
    if (instructor.password !== instructor.confirm)
      throw new HttpException(
        'Passwords are not matching',
        HttpStatus.BAD_REQUEST,
      );
    const hash = await argon2.hash(instructor.password);
    const birthDate = new Date(instructor.dob);
    instructor.image = instructor.gender === 'male' ? 'male.jpg' : 'female.jpg';
    const today = new Date();
    instructor.password = hash;
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
    const iso = new Date(instructor.dob);
    // Adjust age if the current date has not yet reached the birthday for this year
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
    instructor.age = Math.floor(age);

    await this.prisma.instructor.create({
      data: {
        name: instructor.name,
        email: instructor.email,
        major: instructor.major,
        gender: instructor.gender,
        dob: iso,
        age: instructor.age,
        image: instructor.image,
        password: instructor.password,
      },
    });
    return await this.sendVerification(instructor.email);
  }

  public async instructVerify(email: string) {
    const instructor = await this.getInstructorByEmail(email);
    if (!instructor)
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    if (instructor.verified)
      throw new HttpException('User has been verified', HttpStatus.BAD_REQUEST);
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const token = uuidv4();
    if (!instructor.InstructorVerification) {
      await this.prisma.instructor.update({
        where: { email },
        data: {
          InstructorVerification: {
            create: {
              token: token,
              expiredAt: expiryDate,
            },
          },
        },
      });
    } else {
      await this.prisma.instructor.update({
        where: { email },
        data: {
          InstructorVerification: {
            update: {
              token: token,
              expiredAt: expiryDate,
            },
          },
        },
      });
    }

    return token;
  }

  public async sendVerification(email: string) {
    const checkMail = await this.getInstructorByEmail(email);
    if (checkMail && !checkMail.verified) {
      const token = await this.instructVerify(email);
      const verificationLink = `http://localhost:3000/instructor/verification/${checkMail.id}/${token}`;
      console.log(token);
      await this.mailer.sendMail({
        to: checkMail.email,
        subject: 'Tutor at Xawft Academy!',
        template: 'verification', // Template file name without .html extension
        context: {
          name: checkMail.name,
          verificationLink: verificationLink,
        },
      });

      return {
        status: true,
        msg: 'A verification link has been sent to your email',
      };
    } else
      throw new HttpException('Instructor Not Found', HttpStatus.NOT_FOUND);
  }

  public async instructVerification(id: number, token: string) {
    const date = new Date();
    const instructorVerify =
      await this.prisma.instructorVerification.findUnique({
        where: {
          instructorId_token: {
            instructorId: id,
            token: token,
          },
        },
      });

    if (!instructorVerify) {
      throw new HttpException(
        'Invalid or expired verification token',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (date > instructorVerify.expiredAt) {
      throw new HttpException(
        'Expired Verification Token, Please login and retry',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.instructor.update({
      where: { id },
      data: { verified: true },
    });

    return { status: true, msg: 'Instructor successfully verified' };
  }

  public async findAll() {
    return this.prisma.instructor.findMany({
      include: {
        courses: true,
        timetable: true,
        InstructorVerification: true,
        approval: true,
        InstructForgotPassword: true,
      },
    });
  }

  public async findOne(id: number) {
    return await this.prisma.instructor.findUnique({
      where: { id },
      include: {
        courses: true,
        timetable: true,
        InstructForgotPassword: true,
        approval: true,
        InstructorVerification: true,
      },
    });
  }

  public async getInstructorByEmail(email: string) {
    return this.prisma.instructor.findUnique({
      where: { email },
      include: {
        courses: true,
        timetable: true,
        InstructorVerification: true,
        approval: true,
        InstructForgotPassword: true,
      },
    });
  }

  public async InstructPasswordData(email: string) {
    const instructor = await this.getInstructorByEmail(email);
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const token = uuidv4();
    console.log(token);
    if (instructor.InstructForgotPassword === null) {
      await this.prisma.instructor.update({
        where: { id: instructor.id },
        data: {
          InstructForgotPassword: {
            create: {
              token: token,
              expiredAt: expiryDate,
            },
          },
        },
      });
    } else {
      await this.prisma.instructor.update({
        where: { id: instructor.id },
        data: {
          InstructForgotPassword: {
            update: {
              token: token,
              expiredAt: expiryDate,
            },
          },
        },
      });
    }
    return token;
  }

  public async resetPassword(email: string) {
    const instructor = await this.getInstructorByEmail(email);
    const date = new Date();
    if (!instructor) {
      throw new HttpException(
        'Instructor does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (instructor) {
      const token = await this.InstructPasswordData(email);
      const resetLink = `http://localhost:3000/instructor/reset/password/${instructor.id}/${token}`;

      await this.mailer.sendMail({
        to: instructor.email,
        subject: 'Welcome to Xawft Academy!',
        template: 'password', // Template file name without .html extension
        context: {
          name: instructor.name,
          link: resetLink,
          year: date.getFullYear(),
        },
      });

      return {
        status: true,
        msg: 'A password reset link has been sent to your email',
      };
    }
  }

  public async resetPasswordDefault(id: number, token: string) {
    const instructor = await this.findOne(id);
    const date = new Date();
    if (!instructor) {
      throw new HttpException(
        'Instructor does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      date > instructor.InstructForgotPassword.expiredAt ||
      token != instructor.InstructForgotPassword.token
    ) {
      throw new HttpException(
        'Link has expired, Please try again',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.prisma.instructor.update({
      where: { id },
      data: {
        password: '',
      },
    });

    return {
      status: true,
      msg: 'The password has been reset, proceed to change your password',
    };
  }

  public async updateResetPassword(id: number, body: UpdateInstructorDto) {
    const instructor = await this.findOne(id);
    const date = new Date();
    console.log(body);
    if (!instructor) {
      throw new HttpException(
        'Instructor does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (date > instructor.InstructForgotPassword.expiredAt) {
      throw new HttpException(
        'Link has expired, Please try again',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (body.password === body.confirm) {
      const hash = String(argon2.hash(body.password));
      this.prisma.user.update({
        where: { id },
        data: {
          password: hash,
        },
      });
      await this.prisma.instructForgotPassword.delete({
        where: { instructorId: id },
      });
      return { status: true, msg: 'Password updated successfully' };
    } else {
      throw new HttpException('Passwords not matching', HttpStatus.CONFLICT);
    }
  }

  public async googleLoginAndSignup(req, instructor: UpdateInstructorDto) {
    if (!req.user)
        throw new HttpException('Authentication Error', HttpStatus.UNAUTHORIZED);

    const { email, name, picture } = req.user;
    const checkMail = await this.getInstructorByEmail(email);
    
    if (checkMail) {
        return checkMail;
    } else {
        const numbers = "1234567890";
        const symbols = ".,?!@#$%*&";
        let chosen_numbers = "";
        for (let i = 0; i < 2; i++) {
            const random = Math.floor(Math.random() * numbers.length);
            chosen_numbers += numbers[random];
        }
        const chosen_symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const gender = "default";
        // Ensure user is properly initialized
        instructor = {} as UpdateInstructorDto;
        instructor.name = name;
        instructor.email = email;
        instructor.image = picture;
        instructor.verified = true;
        instructor.gender = gender;
        instructor.major = "default";

        const password = name + chosen_numbers + chosen_symbol;
        const hash = await argon2.hash(password);
        instructor.password = hash;

        return this.prisma.instructor.create({
            data: {
                name: instructor.name,
                email: instructor.email,
                image: instructor.image,
                gender: instructor.gender,
                password: instructor.password,
                verified: instructor.verified,
                major: instructor.major,
                dob: new Date()
            },
        });
    }
}

public async generateToken(user: any){
    return {
        access_token: this.jwtService.sign({
            name: user.name,
            sub: user.id
        })
    }
}

  update(id: number, updateInstructorDto: UpdateInstructorDto) {
    return `This action updates a #${id} instructor`;
  }

  remove(id: number) {
    return `This action removes a #${id} instructor`;
  }
}
