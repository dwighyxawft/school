import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'database/prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserGoogleStrategy } from './strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { RandomUtil } from 'src/util/random.util';
import { UserJwtStrategy } from '../auth/user/user-jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TwilioModule } from 'src/providers/twilio/twilio.module';
import { FirebaseModule } from 'src/providers/firebase/firebase.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserGoogleStrategy, RandomUtil, UserJwtStrategy],
  imports: [PrismaModule, MailerModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
    inject: [ConfigService],
  }), MulterModule.register({dest: "./src/uploads/images/users"}), TwilioModule, FirebaseModule],
  exports: [UserService]
})
export class UserModule {}
