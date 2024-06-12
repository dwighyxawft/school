import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../database/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { InstructorModule } from './modules/instructor/instructor.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailer } from './constants/mailer.constants';
import { ConfigModule } from '@nestjs/config';
import { config } from './constants/config.constants';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [PrismaModule, UserModule, InstructorModule, MailerModule.forRoot(mailer), ConfigModule.forRoot(config), AuthModule, AdminModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
