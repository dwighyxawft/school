import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'database/prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { TwilioProvider } from 'src/providers/twilio/twilio.provider';
import { RandomUtil } from 'src/util/random.util';

@Module({
  controllers: [AdminController],
  providers: [AdminService, TwilioProvider, RandomUtil],
  imports: [PrismaModule, MailerModule],
  exports: [AdminService]
})
export class AdminModule {}
