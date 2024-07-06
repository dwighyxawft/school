import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaModule } from 'database/prisma/prisma.module';
import { InstructorModule } from '../instructor/instructor.module';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [PrismaModule, InstructorModule]
})
export class CoursesModule {}
