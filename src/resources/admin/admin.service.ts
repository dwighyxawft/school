import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'database/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { TwilioProvider } from 'src/providers/twilio/twilio.provider';
import { RandomUtil } from 'src/util/random.util';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailerService,
    private twilio: TwilioProvider,
    private random: RandomUtil,
  ) {}
  public async createAdmin(admin: CreateAdminDto) {
    const checkMail = await this.findAdminByEmail(admin.email);
    if (checkMail)
      throw new HttpException('Admin already exists', HttpStatus.BAD_REQUEST);
    admin.name = admin.firstname + ' ' + admin.lastname;
    admin.image = admin.gender === 'male' ? 'male.jpg' : 'female.jpg';
    if (admin.password !== admin.confirm)
      throw new HttpException(
        'Passwords are not matching',
        HttpStatus.CONFLICT,
      );
    const hash = await argon2.hash(admin.password);
    admin.password = hash;

    await this.prisma.admin.create({
      data: {
        name: admin.name,
        email: admin.email,
        gender: admin.gender,
        image: admin.image,
        password: admin.password,
      },
    });

    await this.sendVerification(admin.email);
  }

  public async findAll() {
    return await this.prisma.admin.findMany({
      include: {
        Instructor: true,
        verification: true,
        notifications: true,
        forgotpassword: true,
        whatsapp: true,
      },
    });
  }

  public async findOne(id: number) {
    return await this.prisma.admin.findUnique({
      where: { id },
      include: {
        Instructor: true,
        verification: true,
        notifications: true,
        forgotpassword: true,
        whatsapp: true,
      },
    });
  }

  public async adminPasswordData(email: string) {
    const admin = await this.findAdminByEmail(email);
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const token = uuidv4();
    console.log(token);
    if (!admin.forgotpassword) {
      await this.prisma.admin.update({
        where: { id: admin.id },
        data: {
          forgotpassword: {
            create: {
              token: token,
              createdAt: currentDate,
              expiredAt: expiryDate,
            },
          },
        },
      });
    } else {
      await this.prisma.admin.update({
        where: { id: admin.id },
        data: {
          forgotpassword: {
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

  public async whatsappVerificationData(phone: string) {
    const admin = await this.findAdminByPhone(phone);
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const token = await this.random.randomToken();
    if (!admin.whatsapp) {
      await this.prisma.admin.update({
        where: { id: admin.id },
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
      await this.prisma.admin.update({
        where: { id: admin.id },
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

  public async findAdminByEmail(email: string) {
    return await this.prisma.admin.findUnique({
      where: { email },
      include: {
        Instructor: true,
        verification: true,
        notifications: true,
        forgotpassword: true,
        whatsapp: true,
      },
    });
  }

  public async findAdminByPhone(phone: string) {
    return await this.prisma.admin.findUnique({
      where: { phone },
      include: {
        Instructor: true,
        verification: true,
        notifications: true,
        forgotpassword: true,
        whatsapp: true,
      },
    });
  }

  public async adminVerify(email: string) {
    const admin = await this.findAdminByEmail(email);
    if (!admin)
      throw new HttpException('Admin Not Found', HttpStatus.NOT_FOUND);
    if (admin.verified)
      throw new HttpException(
        'Admin has been verified',
        HttpStatus.BAD_REQUEST,
      );
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const token = uuidv4();
    if (!admin.verification) {
      await this.prisma.admin.update({
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
      await this.prisma.admin.update({
        where: { email },
        data: {
          verification: {
            update: {
              token: token,
              expiredAt: expiryDate,
              used: true
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

  public async sendWhatsappVerification(phone: string) {
    const checkPhone = await this.findAdminByPhone(phone);
    if (!checkPhone)
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    const token = await this.whatsappVerificationData(phone);
    console.log('Token created ', token);
    const body: string =
      'Welcome to xawft academy. To verify your whatsapp contact, use the token ' +
      token +
      ' to verify your whatsapp contact';
    await this.twilio.sendWhatsAppMessage(phone, body);
    return { status: true, msg: 'Token sent to your whatsapp successfully' };
  }

  public async adminVerification(id: number, token: string) {
    const date = new Date();
    const adminVerify = await this.prisma.adminVerification.findUnique({
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

    if (adminVerify.used) {
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

  public async resetPassword(email: string) {
    const admin = await this.findAdminByEmail(email);
    const date = new Date();
    if (!admin) {
      throw new HttpException('Admin does not exist', HttpStatus.NOT_FOUND);
    }

    if (admin) {
      const token = await this.adminPasswordData(email);
      const resetLink = `http://localhost:3000/admin/reset/password/${admin.id}/${token}`;

      await this.mailer.sendMail({
        to: admin.email,
        subject: 'Welcome to Xawft Academy!',
        template: 'password', // Template file name without .html extension
        context: {
          name: admin.name,
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
    const admin = await this.findOne(id);
    const date = new Date();
    if (!admin) {
      throw new HttpException('Admin does not exist', HttpStatus.NOT_FOUND);
    }

    if (
      date > admin.forgotpassword.expiredAt ||
      token != admin.forgotpassword.token ||
      admin.forgotpassword.used
    ) {
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

  public async updateResetPassword(id: number, body: UpdateAdminDto) {
    const admin = await this.findOne(id);
    const date = new Date();
    console.log(body);
    if (!admin) {
      throw new HttpException('Admin does not exist', HttpStatus.NOT_FOUND);
    }

    if (date > admin.forgotpassword.expiredAt) {
      throw new HttpException(
        'Link has expired, Please try again',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (body.password === body.confirm) {
      const hash = String(argon2.hash(body.password));
      this.prisma.admin.update({
        where: { id },
        data: {
          password: hash,
        },
      });
      this.prisma.adminForgotPassword.delete({
        where: { adminId: id },
      });
      return { status: true, msg: 'Password updated successfully' };
    } else {
      throw new HttpException('Passwords not matching', HttpStatus.CONFLICT);
    }
  }

  public async updateEmail(id: number, updates: UpdateAdminDto) {
    const admin = await this.findOne(id);
    if (!admin)
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    if (updates.email === admin.email)
      throw new HttpException(
        'You cannot update to the same email',
        HttpStatus.CONFLICT,
      );
    const checkMail = await this.findAdminByEmail(updates.email);
    if (checkMail)
      throw new HttpException('Admin already exists', HttpStatus.FORBIDDEN);
    await this.prisma.admin.update({
      where: { id },
      data: {
        email: updates.email,
        verified: false,
      },
    });
    return await this.sendVerification(updates.email);
  }

  public async updatePhone(id: number, updates: UpdateAdminDto) {
    const admin = await this.findOne(id);
    if (!admin)
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    const checkPhone = await this.findAdminByPhone(updates.phone);
    if (checkPhone) {
      if (updates.phone !== checkPhone.phone)
        throw new HttpException('Admin already exists', HttpStatus.FORBIDDEN);
    }
    await this.prisma.admin.update({
      where: { id },
      data: {
        phone: updates.phone,
        phoned: false,
      },
    });
    return await this.sendWhatsappVerification(updates.phone);
  }

  public async updatePassword(id: number, updates: UpdateAdminDto) {
    const admin = await this.findOne(id);
    if (!admin)
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    const { previous, password, confirm } = updates;
    if (!(await argon2.verify(previous, admin.password)))
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
    return await this.prisma.admin.update({
      where: { id },
      data: {
        password: hash,
      },
    });
  }

  public async updateImage(id: number, file: Express.Multer.File) {
    const admin = await this.findOne(id);
    if (!admin)
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    return await this.prisma.admin.update({
      where: { id },
      data: {
        image: file.filename,
      },
    });
  }

  public async update(id: number, updates: UpdateAdminDto) {
    const admin = await this.findOne(id);
    if (!admin) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return await this.prisma.user.update({
      where: { id },
      data: {
        name: updates.name,
        gender: updates.gender,
        bio: updates.bio,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
