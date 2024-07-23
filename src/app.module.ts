import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../database/prisma/prisma.module';
import { UserModule } from './resources/user/user.module';
import { InstructorModule } from './resources/instructor/instructor.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailer } from './config/mailer.config';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config.config';
import { AuthModule } from './resources/auth/auth.module';
import { AdminModule } from './resources/admin/admin.module';
import { TransactionModule } from './resources/transaction/transaction.module';
import { CoursesModule } from './resources/courses/courses.module';
import { CategoryModule } from './resources/category/category.module';
import { TimetableModule } from './resources/timetable/timetable.module';
import { MulterModule } from '@nestjs/platform-express';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { EventsModule } from './resources/events/events.module';
import { CroniesModule } from './resources/cronies/cronies.module';
import { InterviewModule } from './resources/interview/interview.module';
import { OpenaiModule } from './providers/openai/openai.module';
import { PaystackModule } from './providers/paystack/paystack.module';
import { TwilioModule } from './providers/twilio/twilio.module';
import { FirebaseModule } from './providers/firebase/firebase.module';

@Module({
  imports: [PrismaModule, UserModule, InstructorModule, MailerModule.forRoot(mailer), ConfigModule.forRoot(config), AuthModule, AdminModule, TransactionModule, CoursesModule, CategoryModule, TimetableModule, MulterModule.register({dest: "./uploads"}), EventEmitterModule.forRoot(), ScheduleModule.forRoot(), EventsModule, CroniesModule, InterviewModule, OpenaiModule, PaystackModule, TwilioModule, FirebaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
