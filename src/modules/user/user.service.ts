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
    private mailer: MailerService
  ) {}
  public async register(data: CreateUserDto) {
    const checkMail = await this.getUserByEmail(data.email);
    if (!checkMail) {
      const token = uuidv4();
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
            userVerification: {
              create: {
                token: token,
                createdAt: new Date
              }
            }
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

  public async sendVerification(email: string) {
    const checkMail = await this.getUserByEmail(email);
    if (checkMail) {
      const token = uuidv4();
      const verificationLink = `http://localhost:3000/user/verification/${checkMail.id}/${token}`;

      await this.prisma.user.update({
        where: { id: checkMail.id },
        data: {
          userVerification: {
            update: {
              token: token,
              createdAt: new Date(),
            },
          },
        },
      });

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

  public async userVerification(id: number, token: string){
    const userVerification = await this.prisma.userVerification.findUnique({
      where: {
        userId_token: {
          userId: id,
          token: token,
        },
      },
    });

    if (!userVerification) {
      throw new HttpException('Invalid or expired verification token', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.user.update({
      where: { id },
      data: { verified: true },
    });

    return { status: true, msg: 'User successfully verified' };

  }

  public async findAll() {
    return await this.prisma.user.findMany({ include: {
      courses: {
        select: {
          course: true
        }
      },
    }})
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
