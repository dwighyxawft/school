import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'database/prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [PrismaModule, MailerModule]
})
export class AdminModule {}
