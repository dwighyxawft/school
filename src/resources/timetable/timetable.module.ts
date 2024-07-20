import { Module } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { InstructorModule } from '../instructor/instructor.module';
import { PrismaModule } from 'database/prisma/prisma.module';
import { CoursesModule } from '../courses/courses.module';
import { TimeUtil } from 'src/util/time.util';

@Module({
  controllers: [TimetableController],
  providers: [TimetableService, TimeUtil],
  imports: [InstructorModule, PrismaModule, CoursesModule],
  exports: [TimetableService]
})
export class TimetableModule {}
