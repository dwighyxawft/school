import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'database/prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserGoogleStrategy } from './strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from 'src/constants/jwt.constant';
import { TwilioProvider } from 'src/providers/twilio/twilio.provider';
import { RandomUtil } from 'src/util/random.util';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, UserGoogleStrategy, TwilioProvider, RandomUtil, JwtStrategy],
  imports: [PrismaModule, MailerModule, JwtModule.register(jwtOptions)],
  exports: [UserService]
})
export class UserModule {}
