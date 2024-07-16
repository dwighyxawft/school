import { HttpException, HttpStatus, Injectable, ExecutionContext } from '@nestjs/common';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { InstructorService } from '../instructor/instructor.service';
import { PrismaService } from 'database/prisma/prisma.service';
import { TimeUtil } from 'src/util/time.util';
import { Days } from 'src/enums/days.enum';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CoursesService } from '../courses/courses.service';
import { TwilioProvider } from 'src/providers/twilio/twilio.provider';
import { UserService } from '../user/user.service';

@Injectable()
export class TimetableService {
  constructor(
    private instructService: InstructorService,
    private prisma: PrismaService,
    private timeUtil: TimeUtil,
    private schedulerRegistry: SchedulerRegistry,
    private courseService: CoursesService,
    private twilio: TwilioProvider, 
    private userService: UserService
  ) {}
  public async create(
    timetable: CreateTimetableDto,
    id: number,
    course_id: number,
  ) {
    const instructor = await this.instructService.findOne(id);
    if (!instructor)
      throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
    if (!instructor.courses.find((course) => course.id == course_id))
      throw new HttpException(
        'Course Not Found',
        HttpStatus.EXPECTATION_FAILED,
      );
    if (instructor.timetable.length == 6)
      throw new HttpException(
        'Timetable limit reached',
        HttpStatus.BAD_REQUEST,
      );
    const timedStart = await this.timeUtil.timeStringToDate(timetable.start);
    const timedEnd = await this.timeUtil.timeStringToDate(timetable.end);
    timetable.courseId = course_id;
    timetable.instructorId = instructor.id;
    let timerEnd = timedStart.getTime();
    timerEnd += 1000 * 60 * timetable.duration;
    const endingDate = new Date(timerEnd);
    const endingTime =
      endingDate.getHours() +
      ':' +
      endingDate.getMinutes() +
      ':' +
      endingDate.getSeconds();
    timetable.end = endingTime;
    // cancel the foreach below and use filter
    const conflict = instructor.timetable.filter(async (classes) => {
      if (classes.day === timetable.day) {
        const classDayStart = await this.timeUtil.timeStringToDate(
          classes.start,
        );
        const classDayEnd = await this.timeUtil.timeStringToDate(classes.end);
        let get_end_time = classDayEnd.getTime();
        get_end_time += 1000 * 60 * 20;
        const extra_ten = new Date(get_end_time);
        if (classDayStart === timedStart) return true;
        if (
          classDayStart > timedStart &&
          classDayStart < timedEnd &&
          (classDayEnd > timedEnd || classes.duration == timetable.duration)
        )
          return true;
        if (
          timedStart > classDayStart &&
          timedStart < classDayEnd &&
          (timedEnd > classDayEnd || classes.duration == timetable.duration)
        )
          return true;
        if (
          classDayStart < timedStart &&
          classDayEnd > timedStart &&
          timedEnd > classDayEnd &&
          classes.duration < timetable.duration
        )
          return true;
        if (
          timedStart < classDayStart &&
          timedEnd > classDayStart &&
          classDayStart > timedEnd &&
          timetable.duration < classes.duration
        )
          return true;
        if (timedStart <= extra_ten) return false;
      } else {
        return false;
      }
    });

    if (conflict.length > 0)
      throw new HttpException(
        'A class is clashing with your timing',
        HttpStatus.CONFLICT,
      );
    return this.prisma.timetable.create({ data: timetable });
  }

  public async findAll() {
    return this.prisma.timetable.findMany({ include: {
      course: true,
        instructor: true
    }});
  }

  public async findOne(id: number) {
    return this.prisma.timetable.findUnique({ where: { id }, include: {
        course: true,
        instructor: true
    } });
  }

  public async getTimetbleByInstructor(id: number) {
    const instructor = await this.instructService.findOne(id);
    if (!instructor)
      throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
    return this.prisma.timetable.findMany({ where: { instructorId: id } });
  }

  public async getTimetableByCourses(id: number, course_id: number) {
    const instructor = await this.instructService.findOne(id);
    if (!instructor)
      throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
    if (!instructor.courses.find((course) => course.id == course_id))
      throw new HttpException('Course not found', HttpStatus.CONFLICT);
    return this.prisma.timetable.findMany({ where: { courseId: course_id } });
  }

  public async getTodaysTimetable(day: Days){
    return await this.prisma.timetable.findMany({ where: { day: day }});
  }

  public async update(id: number,
    course_id: number, timetable: UpdateTimetableDto, timetable_id: number) {
      const instructor = await this.instructService.findOne(id);
      if (!instructor)
        throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
      if (!instructor.courses.find((course) => course.id == course_id))
        throw new HttpException(
          'Course Not Found',
          HttpStatus.EXPECTATION_FAILED,
        );
      if (instructor.timetable.length == 4)
        throw new HttpException(
          'Timetable limit reached',
          HttpStatus.BAD_REQUEST,
        );
      const timedStart = await this.timeUtil.timeStringToDate(timetable.start);
      const timedEnd = await this.timeUtil.timeStringToDate(timetable.end);
      timetable.courseId = course_id;
      timetable.instructorId = instructor.id;
      let timerEnd = timedStart.getTime();
      timerEnd += 1000 * 60 * timetable.duration;
      const endingDate = new Date(timerEnd);
      const endingTime =
        endingDate.getHours() +
        ':' +
        endingDate.getMinutes() +
        ':' +
        endingDate.getSeconds();
      timetable.end = endingTime;
      // cancel the foreach below and use filter
      const conflict = instructor.timetable.filter(async (classes) => {
        if (classes.day === timetable.day) {
          const classDayStart = await this.timeUtil.timeStringToDate(
            classes.start,
          );
          const classDayEnd = await this.timeUtil.timeStringToDate(classes.end);
          let get_end_time = classDayEnd.getTime();
          get_end_time += 1000 * 60 * 20;
          const extra_ten = new Date(get_end_time);
          if (classDayStart === timedStart) return false;
          if (
            classDayStart > timedStart &&
            classDayStart < timedEnd &&
            (classDayEnd > timedEnd || classes.duration == timetable.duration)
          )
            return false;
          if (
            timedStart > classDayStart &&
            timedStart < classDayEnd &&
            (timedEnd > classDayEnd || classes.duration == timetable.duration)
          )
            return false;
          if (
            classDayStart < timedStart &&
            classDayEnd > timedStart &&
            timedEnd > classDayEnd &&
            classes.duration < timetable.duration
          )
            return false;
          if (
            timedStart < classDayStart &&
            timedEnd > classDayStart &&
            classDayStart > timedEnd &&
            timetable.duration < classes.duration
          )
            return false;
          if (timedStart <= extra_ten) return false;
        } else {
          return true;
        }
      });
  
      if (conflict.length > 0)
        throw new HttpException(
          'A class is clashing with your timing',
          HttpStatus.CONFLICT,
        );
      return this.prisma.timetable.update({ where: { id: timetable_id },  data: timetable });
  }

  public async remove(id: number) {
    return this.prisma.timetable.delete({where: { id }});
  }

  public async signalAllUsersForTodaysClasses() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date();
    const today = days[date.getDay()];
    const daysEnum = Days;
    const day = daysEnum[today];
    const timetable = await this.getTodaysTimetable(day);

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
    const timetable = await this.findOne(id);
    const course = await this.courseService.findOne(timetable.courseId);
    course.users.forEach(async (user_payload) => {
      const user = await this.userService.findOne(user_payload.userId);
      const body = `You are having a the ${course.title} class. Please prepare`;
      await this.twilio.sendWhatsAppMessage(user.phone, body);
    })
  }

}
