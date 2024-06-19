import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { PrismaModule } from 'database/prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { InstructorGoogleStrategy } from './strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from 'src/constants/jwt.constant';

@Module({
  controllers: [InstructorController],
  providers: [InstructorService, InstructorGoogleStrategy],
  imports: [PrismaModule, MailerModule, JwtModule.register(jwtOptions)]
})
export class InstructorModule {}
