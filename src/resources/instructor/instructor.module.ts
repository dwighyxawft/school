import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { PrismaModule } from 'database/prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { InstructorGoogleStrategy } from './strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from 'src/constants/jwt.constant';
import { TwilioProvider } from 'src/providers/twilio/twilio.provider';
import { RandomUtil } from 'src/util/random.util';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  controllers: [InstructorController],
  providers: [InstructorService, InstructorGoogleStrategy, TwilioProvider, RandomUtil, JwtStrategy],
  imports: [PrismaModule, MailerModule, JwtModule.register(jwtOptions)],
  exports: [InstructorService]
})
export class InstructorModule {}
