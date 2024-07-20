import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TimetableService } from '../timetable/timetable.service';
import { TimeUtil } from 'src/util/time.util';
import { TwilioProvider } from 'src/providers/twilio/twilio.provider';
import { UserService } from '../user/user.service';
import { CoursesService } from '../courses/courses.service';
import { Days } from 'src/enums/days.enum';
import { CronJob } from 'cron';

@Injectable()
export class CroniesService {

    constructor( private schedulerRegistry: SchedulerRegistry, private timetableService: TimetableService, private timeUtil: TimeUtil, private twilio: TwilioProvider, private userService: UserService, private courseService: CoursesService) {}

    public async signalAllUsersForTodaysClasses() {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date();
        const today = days[date.getDay()];
        const daysEnum = Days;
        const day = daysEnum[today];
        const timetable = await this.timetableService.getTodaysTimetable(day);
    
        timetable.forEach(async (timer) => {
          const classTime = await this.timeUtil.timeStringToDate(timer.start);
          const classTimeMinus5 = new Date(classTime.getTime() - 1000 * 60 * 5);
    
          await this.scheduleCronJob(classTime, timer);
          await this.scheduleCronJob(classTimeMinus5, timer);
        });
      }
    
      private scheduleCronJob(date: Date, timer: any) {
        const cronTime = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
        const jobName = `signalClass_${timer.id}_${date.getTime()}`;
    
        const job = new CronJob(cronTime, () => {
          this.signalAllUsersForClass(timer.id);
        });
    
        this.schedulerRegistry.addCronJob(jobName, job);
        job.start();
      }
    
      private async signalAllUsersForClass(id: number){
        const timetable = await this.timetableService.findOne(id);
        const course = await this.courseService.findOne(timetable.courseId);
        course.users.forEach(async (user_payload) => {
          const user = await this.userService.findOne(user_payload.userId);
          const body = `You are having a the ${course.title} class. Please prepare`;
          await this.twilio.sendWhatsAppMessage(user.phone, body)
          await this.twilio.sendSMS(user.phone, body);
        })
      }
}
