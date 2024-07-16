import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { PrismaModule } from 'database/prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { InstructorGoogleStrategy } from './strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TwilioProvider } from 'src/providers/twilio/twilio.provider';
import { RandomUtil } from 'src/util/random.util';
import { InstructorJwtStrategy } from '../auth/instructor/instructor-jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [InstructorController],
  providers: [InstructorService, InstructorGoogleStrategy, TwilioProvider, RandomUtil, InstructorJwtStrategy],
  imports: [PrismaModule, MailerModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
    inject: [ConfigService],
  }), MulterModule.register({dest: "./src/uploads/images/instructors"}),],
  exports: [InstructorService]
})
export class InstructorModule {}
