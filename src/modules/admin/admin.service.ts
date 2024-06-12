import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'database/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private mailer: MailerService){}
  public async createAdmin(admin: CreateAdminDto) {
      const checkMail = await this.findAdminByEmail(admin.email);
      if(checkMail) throw new HttpException("Admin already exists", HttpStatus.BAD_REQUEST);
      admin.name = admin.firstname + " " + admin.lastname;
      admin.image = admin.gender === "male" ? "male.jpg" : "female.jpg";
      if(admin.password !== admin.confirm) throw new HttpException("Passwords are not matching", HttpStatus.CONFLICT);
      const hash = await argon2.hash(admin.password);
      admin.password = hash;

      await this.prisma.admin.create({ data: {
        name: admin.name,
        email: admin.email,
        gender: admin.gender,
        image: admin.image,
        password: admin.password
      }})

      await this.sendVerification(admin.email);
  }

  public async findAll() {
    return await this.prisma.admin.findMany({include: {
      Instructor: true,
      AdminVerification: true
    }})
  }

  public async findOne(id: number) {
    return await this.prisma.admin.findUnique({ where: {id}, include: {
      Instructor: true,
      AdminVerification: true
    }})
  }

  public async findAdminByEmail(email: string){
    return await this.prisma.admin.findUnique({ where: {email}, include: {
      Instructor: true,
      AdminVerification: true
    }})
  }

  public async adminVerify(email: string) {
    const admin = await this.findAdminByEmail(email);
    if (!admin)
      throw new HttpException('Admin Not Found', HttpStatus.NOT_FOUND);
    if (admin.verified)
      throw new HttpException('Admin has been verified', HttpStatus.BAD_REQUEST);
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const token = uuidv4();
    if (!admin.AdminVerification) {
      await this.prisma.admin.update({
        where: { email },
        data: {
          AdminVerification: {
            create: {
              token: token,
              expiredAt: expiryDate,
            },
          },
        },
      });
    } else {
      await this.prisma.admin.update({
        where: { email },
        data: {
          AdminVerification: {
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
    const checkMail = await this.findAdminByEmail(email);
    if (checkMail && !checkMail.verified) {
      const token = await this.adminVerify(email);
      const verificationLink = `http://localhost:3000/instructor/verification/${checkMail.id}/${token}`;
      console.log(token);
      await this.mailer.sendMail({
        to: checkMail.email,
        subject: 'Admin at Xawft Academy!',
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
    } else throw new HttpException('Admin Not Found', HttpStatus.NOT_FOUND);
  }

  public async adminVerification(id: number, token: string) {
    const date = new Date();
    const adminVerify =
      await this.prisma.adminVerification.findUnique({
        where: {
          adminId_token: {
            adminId: id,
            token: token,
          },
        },
      });

    if (!adminVerify) {
      throw new HttpException(
        'Invalid or expired verification token',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (date > adminVerify.expiredAt) {
      throw new HttpException(
        'Expired Verification Token, Please login and retry',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.admin.update({
      where: { id },
      data: { verified: true },
    });

    return { status: true, msg: 'Admin successfully verified' };
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
