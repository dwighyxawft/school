import { Module } from '@nestjs/common';
import { CroniesService } from './cronies.service';
import { CroniesController } from './cronies.controller';
import { TimeUtil } from 'src/util/time.util';
import { TwilioProvider } from 'src/providers/twilio/twilio.provider';
import { UserModule } from '../user/user.module';
import { CoursesModule } from '../courses/courses.module';
import { TimetableModule } from '../timetable/timetable.module';

@Module({
  controllers: [CroniesController],
  providers: [CroniesService, TimeUtil, TwilioProvider],
  imports: [UserModule, CoursesModule, TimetableModule]
})
export class CroniesModule {}
