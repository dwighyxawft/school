import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'database/prisma/prisma.service';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TwilioProvider } from 'src/providers/twilio/twilio.provider';
import { RandomUtil } from 'src/util/random.util';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailerService,
    private config: ConfigService,
    private jwtService: JwtService,
    private twilio: TwilioProvider,
    private random: RandomUtil,
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
        return await this.sendVerification(user.email);
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
        whatsappVerification: true,
      },
    });
  }

  public async getUserByPhone(phone: string) {
    return this.prisma.user.findUnique({
      where: { phone },
      include: {
        courses: {
          select: {
            course: true,
          },
        },
        userVerification: true,
        forgotPassword: true,
        whatsappVerification: true,
      },
    });
  }

  public async userVerificationData(email: string) {
    const user = await this.getUserByEmail(email);
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const token = uuidv4();
    console.log(token);
    if (!user.userVerification) {
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

  public async whatsappVerificationData(phone: string) {
    const user = await this.getUserByPhone(phone);
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const token = await this.random.randomToken();
    if (!user.whatsappVerification) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          whatsappVerification: {
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
          whatsappVerification: {
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
    if (!user.forgotPassword) {
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

  public async sendWhatsappVerification(phone: string) {
    const checkPhone = await this.getUserByPhone(phone);
    if (!checkPhone)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const token = await this.whatsappVerificationData(phone);
    console.log('Token created ', token);
    const body: string =
      'Welcome to xawft academy. To verify your whatsapp contact, use the token ' +
      token +
      ' to verify your whatsapp contact';
    await this.twilio.sendWhatsAppMessage(phone, body);
    return { status: true, msg: 'Token sent to your whatsapp successfully' };
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

  public async verifyPhone(id: number, token: string) {
    const user = await this.findOne(id);
    const date = new Date();
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (!user.whatsappVerification || user.whatsappVerification == null)
      throw new HttpException(
        'Whatsapp verification not initialized',
        HttpStatus.BAD_REQUEST,
      );
    if (token !== user.whatsappVerification.token)
      throw new HttpException('Token is incorrect', HttpStatus.CONFLICT);
    if (
      token === user.whatsappVerification.token &&
      date > user.whatsappVerification.expiredAt
    )
      throw new HttpException(
        'Token has expired, Please request for a new one',
        HttpStatus.EXPECTATION_FAILED,
      );
    return await this.prisma.user.update({
      where: { id },
      data: {
        phoned: true,
      },
    });
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
        transactions: true,
        whatsappVerification: true,
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
        transactions: true,
        forgotPassword: true,
        whatsappVerification: true,
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

    if (
      date > user.forgotPassword.expiredAt ||
      token != user.forgotPassword.token
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

  public async googleLoginAndSignup(req, user: UpdateUserDto) {
    if (!req.user)
      throw new HttpException('Authentication Error', HttpStatus.UNAUTHORIZED);

    const { email, name, picture } = req.user;
    const checkMail = await this.getUserByEmail(email);

    if (checkMail) {
      return checkMail;
    } else {
      const chosen = await this.random.randomPassword();
      const gender = 'default';
      // Ensure user is properly initialized
      user = {} as UpdateUserDto;
      user.name = name;
      user.email = email;
      user.image = picture;
      user.verified = true;
      user.gender = gender;

      const password = name + chosen;
      const hash = await argon2.hash(password);
      user.password = hash;

      return this.prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          image: user.image,
          gender: user.gender,
          password: user.password,
          verified: user.verified,
        },
      });
    }
  }

  public async generateToken(user: any) {
    return {
      access_token: this.jwtService.sign({
        name: user.name,
        sub: user.id,
      }),
    };
  }

  public async update(id: number, updates: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if(user.gender !== "default"){
      return await this.prisma.user.update({
        where: { id },
        data: {
          name: updates.name,
          gender: updates.gender,
          bio: updates.bio,
        },
      });
    }else{
      return await this.prisma.user.update({
        where: { id },
        data: {
          name: updates.name,
          bio: updates.bio,
        },
      });
    }
  }

  public async updateEmail(id: number, updates: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (updates.email === user.email)
      throw new HttpException(
        'You cannot update to the same email',
        HttpStatus.CONFLICT,
      );
    const checkMail = await this.getUserByEmail(updates.email);
    if (checkMail)
      throw new HttpException('User already exists', HttpStatus.FORBIDDEN);
    await this.prisma.user.update({
      where: { id },
      data: {
        email: updates.email,
        verified: false,
      },
    });
    return await this.sendVerification(updates.email);
  }

  public async updatePhone(id: number, updates: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const checkPhone = await this.getUserByPhone(updates.phone);
    if (checkPhone) {
      if (updates.phone !== checkPhone.phone)
        throw new HttpException('User already exists', HttpStatus.FORBIDDEN);
    }
    await this.prisma.user.update({
      where: { id },
      data: {
        phone: updates.phone,
        phoned: false,
      },
    });
    return await this.sendWhatsappVerification(updates.phone);
  }

  public async updatePassword(id: number, updates: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const { previous, password, confirm } = updates;
    if (!(await argon2.verify(previous, user.password)))
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
    return await this.prisma.user.update({
      where: { id },
      data: {
        password: hash,
      },
    });
  }

  public async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

    if (user.forgotPassword !== null) {
      await this.prisma.forgotPassword.delete({
        where: { userId: id },
      });
    }

    if (user.userVerification !== null) {
      await this.prisma.userVerification.delete({
        where: { userId: id },
      });
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
