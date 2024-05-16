import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../database/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { InstructorModule } from './modules/instructor/instructor.module';
import { PhoneModule } from './providers/phone/phone.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailer } from './constants/mailer.constants';
import { ConfigModule } from '@nestjs/config';
import { config } from './constants/config.constants';

@Module({
  imports: [PrismaModule, UserModule, InstructorModule, PhoneModule, MailerModule.forRoot(mailer), ConfigModule.forRoot(config),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
