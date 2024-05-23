import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'database/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailerService,
  ) {}
  public async register(data: CreateUserDto) {
    const checkMail = await this.getUserByEmail(data.email);
    if (!checkMail) {
      data.image = data.gender == 'male' ? 'male.jpg' : 'female.jpg';
      data.name = data.firstname + ' ' + data.lastname;
      if (data.password === data.confirm) {
        const hash = await argon2.hash(data.password);
        data.password = hash;
        const user = await this.prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            gender: data.gender,
            image: data.image,
            password: data.password,
            createdAt: new Date(),
          },
        });
        await this.sendVerification(user.email);
        return { status: true, msg: 'User registration successful' };
      } else {
        return { status: false, msg: 'Passwords are not matching' };
      }
    } else {
      return { status: false, msg: 'User exists in the database' };
    }
  }

  public async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        courses: {
          select: {
            course: true,
          },
        },
        userVerification: true,
        forgotPassword: true,
      },
    });
  }

  public async userVerificationData(email: string) {
    const user = await this.getUserByEmail(email);
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const token = uuidv4();
    console.log(token);
    if (user.userVerification == null) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          userVerification: {
            create: {
              token: token,
              createdAt: currentDate,
              expiredAt: expiryDate,
            },
          },
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          userVerification: {
            update: {
              token: token,
              createdAt: currentDate,
              expiredAt: expiryDate,
            },
          },
        },
      });
    }
    return token;
  }

  public async userPasswordData(email: string) {
    const user = await this.getUserByEmail(email);
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const token = uuidv4();
    console.log(token);
    if (user.forgotPassword == null) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          forgotPassword: {
            create: {
              token: token,
              createdAt: currentDate,
              expiredAt: expiryDate,
            },
          },
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          forgotPassword: {
            update: {
              token: token,
              createdAt: currentDate,
              expiredAt: expiryDate,
            },
          },
        },
      });
    }
    return token;
  }

  public async sendVerification(email: string) {
    const checkMail = await this.getUserByEmail(email);
    if (checkMail && !checkMail.verified) {
      const token = await this.userVerificationData(email);
      const verificationLink = `http://localhost:3000/user/verification/${checkMail.id}/${token}`;

      await this.mailer.sendMail({
        to: checkMail.email,
        subject: 'Welcome to Xawft Academy!',
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
    } else {
      return { status: false, msg: 'User does not exist' };
    }
  }

  public async userVerification(id: number, token: string) {
    const date = new Date();
    const userVerification = await this.prisma.userVerification.findUnique({
      where: {
        userId_token: {
          userId: id,
          token: token,
        },
      },
    });

    if (!userVerification) {
      throw new HttpException(
        'Invalid or expired verification token',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (date > userVerification.expiredAt) {
      throw new HttpException(
        'Expired Verification Token, Please login and retry',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.user.update({
      where: { id },
      data: { verified: true },
    });

    return { status: true, msg: 'User successfully verified' };
  }

  public async findAll() {
    return await this.prisma.user.findMany({
      include: {
        courses: {
          select: {
            course: true,
          },
        },
        userVerification: true,
      },
    });
  }

  public async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        courses: {
          select: {
            course: true,
          },
        },
        userVerification: true,
        forgotPassword: true,
      },
    });
  }

  public async resetPassword(email: string) {
    const user = await this.getUserByEmail(email);
    const date = new Date();
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    if (user) {
      const token = await this.userPasswordData(email);
      const resetLink = `http://localhost:3000/user/reset/password/${user.id}/${token}`;

      await this.mailer.sendMail({
        to: user.email,
        subject: 'Welcome to Xawft Academy!',
        template: 'password', // Template file name without .html extension
        context: {
          name: user.name,
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
    const user = await this.findOne(id);
    const date = new Date();
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    if (date > user.forgotPassword.expiredAt || token != user.forgotPassword.token) {
      throw new HttpException(
        'Link has expired, Please try again',
        HttpStatus.BAD_REQUEST,
      );
    }


    this.prisma.user.update({
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

  public async updateResetPassword(id: number, body: UpdateUserDto) {
    const user = await this.findOne(id);
    const date = new Date();
    console.log(body);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    if (date > user.forgotPassword.expiredAt) {
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
      this.prisma.forgotPassword.delete({
        where: { userId: id },
      });
      return { status: true, msg: 'Password updated successfully' };
    } else {
      throw new HttpException('Passwords not matching', HttpStatus.CONFLICT);
    }
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  public async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
