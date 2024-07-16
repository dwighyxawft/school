import { Module } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { InstructorModule } from '../instructor/instructor.module';
import { PrismaModule } from 'database/prisma/prisma.module';
import { TimeUtil } from 'src/util/time.util';
import { CoursesModule } from '../courses/courses.module';
import { TwilioProvider } from 'src/providers/twilio/twilio.provider';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [TimetableController],
  providers: [TimetableService, TimeUtil, TwilioProvider],
  imports: [InstructorModule, PrismaModule, CoursesModule, UserModule],
})
export class TimetableModule {}
