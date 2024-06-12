import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { PrismaModule } from 'database/prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [InstructorController],
  providers: [InstructorService],
  imports: [PrismaModule, MailerModule]
})
export class InstructorModule {}
