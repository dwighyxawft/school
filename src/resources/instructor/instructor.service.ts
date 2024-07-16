import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { PrismaService } from 'database/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { TwilioProvider } from 'src/providers/twilio/twilio.provider';
import { RandomUtil } from 'src/util/random.util';

@Injectable()
export class InstructorService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailerService,
    private jwtService: JwtService,
    private twilio: TwilioProvider,
    private random: RandomUtil,
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
    if (!instructor.verification) {
      await this.prisma.instructor.update({
        where: { email },
        data: {
          verification: {
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
          verification: {
            update: {
              token: token,
              expiredAt: expiryDate,
              used: false
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

  public async sendWhatsappVerification(phone: string) {
    const checkPhone = await this.getInstructorByPhone(phone);
    if (!checkPhone)
      throw new HttpException('Insructor not found', HttpStatus.NOT_FOUND);
    const token = await this.whatsappVerificationData(phone);
    const body: string =
      'Welcome to xawft academy. To verify your whatsapp contact, use the token ' +
      token +
      ' to verify your whatsapp contact';
    await this.twilio.sendWhatsAppMessage(phone, body);
    return { status: true, msg: 'Token sent to your whatsapp successfully' };
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

    if (instructorVerify.used) {
      throw new HttpException(
        'This token has been used',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.instructor.update({
      where: { id },
      data: { verified: true, 
        verification: {
          update: {
            used: true
          }
        }
       },
    });

    return { status: true, msg: 'Instructor successfully verified' };
  }

  public async verifyPhone(id: number, token: string) {
    const instructor = await this.findOne(id);
    const date = new Date();
    if (!instructor) throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
    if (!instructor.whatsapp || instructor.whatsapp == null)
      throw new HttpException(
        'Whatsapp verification not initialized',
        HttpStatus.BAD_REQUEST,
      );
    if (token !== instructor.whatsapp.token)
      throw new HttpException('Token is incorrect', HttpStatus.CONFLICT);
    if (
      token === instructor.whatsapp.token &&
      date > instructor.whatsapp.expiredAt
    )
      throw new HttpException(
        'Token has expired, Please request for a new one',
        HttpStatus.EXPECTATION_FAILED,
      );

      if (
        token === instructor.whatsapp.token &&
        date < instructor.whatsapp.expiredAt &&
        instructor.whatsapp.used
      )
        throw new HttpException(
          'Token has expired, Please request for a new one',
          HttpStatus.EXPECTATION_FAILED,
        );
    return await this.prisma.instructor.update({
      where: { id },
      data: {
        phoned: true,
      },
    });
  }

  public async findAll() {
    return this.prisma.instructor.findMany({
      include: {
        courses: true,
        timetable: true,
        verification: true,
        approval: true,
        forgotpassword: true,
        transactions: true,
        whatsapp: true,
      },
    });
  }

  public async findOne(id: number) {
    return await this.prisma.instructor.findUnique({
      where: { id },
      include: {
        courses: true,
        timetable: true,
        verification: true,
        approval: true,
        forgotpassword: true,
        transactions: true,
        whatsapp: true,
      },
    });
  }

  public async getInstructorByEmail(email: string) {
    return this.prisma.instructor.findUnique({
      where: { email },
      include: {
        courses: true,
        timetable: true,
        verification: true,
        approval: true,
        forgotpassword: true,
        transactions: true,
        whatsapp: true,
      },
    });
  }

  public async getInstructorByPhone(phone: string) {
    return this.prisma.instructor.findUnique({
      where: { phone },
      include: {
        courses: true,
        timetable: true,
        verification: true,
        approval: true,
        forgotpassword: true,
        transactions: true,
        whatsapp: true,
      },
    });
  }

  public async whatsappVerificationData(phone: string) {
    const instructor = await this.getInstructorByPhone(phone);
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const token = await this.random.randomToken();
    if (!instructor.whatsapp) {
      await this.prisma.instructor.update({
        where: { id: instructor.id },
        data: {
          whatsapp: {
            create: {
              token: token,
              createdAt: currentDate,
              expiredAt: expiryDate,
            },
          },
        },
      });
    } else {
      await this.prisma.instructor.update({
        where: { id: instructor.id },
        data: {
          whatsapp: {
            update: {
              token: token,
              createdAt: currentDate,
              expiredAt: expiryDate,
              used: false
            },
          },
        },
      });
    }
    return token;
  }

  public async InstructPasswordData(email: string) {
    const instructor = await this.getInstructorByEmail(email);
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const token = uuidv4();
    console.log(token);
    if (instructor.forgotpassword === null) {
      await this.prisma.instructor.update({
        where: { id: instructor.id },
        data: {
          forgotpassword: {
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
          forgotpassword: {
            update: {
              token: token,
              expiredAt: expiryDate,
              used: false
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
      date > instructor.forgotpassword.expiredAt ||
      token != instructor.forgotpassword.token ||
      instructor.forgotpassword.used
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
        forgotpassword: {
          update: {
            used: true
          }
        }
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

    if (date > instructor.forgotpassword.expiredAt) {
      throw new HttpException(
        'Link has expired, Please try again',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (body.password === body.confirm) {
      const hash = String(await argon2.hash(body.password));
      await this.prisma.instructor.update({
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
       
        const gender = "default";
        // Ensure user is properly initialized
        instructor = {} as UpdateInstructorDto;
        instructor.name = name;
        instructor.email = email;
        instructor.image = picture;
        instructor.verified = true;
        instructor.gender = gender;
        instructor.major = "default";
        const chosen = await this.random.randomPassword();
        const password = name + chosen;
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

  public async update(id: number, updates: UpdateInstructorDto) {
    const instructor = await this.findOne(id);
    if (!instructor) throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
    const birthDate = new Date(updates.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
    // Adjust age if the current date has not yet reached the birthday for this year
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
    updates.age = Math.floor(age);
    if(instructor.gender === "default"){
      return await this.prisma.instructor.update({
        where: { id },
        data: {
          name: updates.name,
          gender: updates.gender,
          bio: updates.bio,
          dob: birthDate,
          age: updates.age,
          major: updates.major
        },
      });
    }else{
      return await this.prisma.instructor.update({
        where: { id },
        data: {
          name: updates.name,
          bio: updates.bio,
          dob: birthDate,
          age: updates.age,
          major: updates.major
        },
      });
    }
   
  }

  public async updateEmail(id: number, updates: UpdateInstructorDto) {
    const instructor = await this.findOne(id);
    if (!instructor) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (updates.email === instructor.email)
      throw new HttpException(
        'You cannot update to the same email',
        HttpStatus.CONFLICT,
      );
    const checkMail = await this.getInstructorByEmail(updates.email);
    if (checkMail)
      throw new HttpException('Instructor already exists', HttpStatus.FORBIDDEN);
    await this.prisma.instructor.update({
      where: { id },
      data: {
        email: updates.email,
        verified: false,
      },
    });
    return await this.sendVerification(updates.email);
  }

  public async updatePhone(id: number, updates: UpdateInstructorDto) {
    const instructor = await this.findOne(id);
    if (!instructor) throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
    const checkPhone = await this.getInstructorByPhone(updates.phone);
    if (checkPhone){
      if(updates.phone !== checkPhone.phone)throw new HttpException('Instructor already exists', HttpStatus.FORBIDDEN);
    }
      
    await this.prisma.instructor.update({
      where: { id },
      data: {
        phone: updates.phone,
        phoned: false,
      },
    });
    return await this.sendWhatsappVerification(updates.phone);
  }

  public async updatePassword(id: number, updates: UpdateInstructorDto) {
    const instructor = await this.findOne(id);
    if (!instructor) throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
    const { previous, password, confirm } = updates;
    if (!(await argon2.verify(previous, instructor.password)))
      throw new HttpException(
        'Password is incorrect',
        HttpStatus.EXPECTATION_FAILED,
      );
    if (password !== confirm)
      throw new HttpException(
        'Passwords are not matching',
        HttpStatus.CONFLICT,
      );
    const hash = await argon2.hash(password);
    return await this.prisma.instructor.update({
      where: { id },
      data: {
        password: hash,
      },
    });
  }

  public async updateImage(id: number, file: Express.Multer.File) {
    const instructor = await this.findOne(id);
    if (!instructor) throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
    return this.prisma.instructor.update({ where: { id }, data: {
      image: file.filename
    }})
  }

  remove(id: number) {
    return `This action removes a #${id} instructor`;
  }

  

}
