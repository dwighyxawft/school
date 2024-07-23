import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'database/prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { RandomUtil } from 'src/util/random.util';
import { MulterModule } from '@nestjs/platform-express';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from 'src/providers/twilio/twilio.module';
import { FirebaseModule } from 'src/providers/firebase/firebase.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService, RandomUtil],
  imports: [PrismaModule, MailerModule, MulterModule.register({dest: "./src/uploads/images/admins"}), JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
    inject: [ConfigService],
  }), TwilioModule, FirebaseModule, Object],
  exports: [AdminService]
})
export class AdminModule {}
