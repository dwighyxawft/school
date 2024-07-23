import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaModule } from 'database/prisma/prisma.module';
import { InstructorModule } from '../instructor/instructor.module';
import { CategoryModule } from '../category/category.module';
import { MulterModule } from '@nestjs/platform-express';
import { FirebaseModule } from 'src/providers/firebase/firebase.module';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [PrismaModule, InstructorModule, CategoryModule, MulterModule.register({dest: "./src/uploads/images/courses"}), FirebaseModule],
  exports: [CoursesService]
})
export class CoursesModule {}
