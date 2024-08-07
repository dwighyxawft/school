import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Request, UploadedFile } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InstructorJwtAuthGuard } from '../auth/instructor/instructor-jwt-auth.guard';
import { InstructorAuthInterceptor } from 'src/interceptors/instructor-auth.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/providers/firebase/firebase.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService, private firebase: FirebaseService) {}
  
  @UseInterceptors(InstructorAuthInterceptor)
  @UseGuards(InstructorJwtAuthGuard)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @Request() req) {
    return this.coursesService.create(createCourseDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @UseInterceptors(InstructorAuthInterceptor)
  @UseGuards(InstructorJwtAuthGuard)
  @Patch(':course_id')
  update(@Param('course_id') course_id: string, @Body() updateCourseDto: UpdateCourseDto, @Request() req) {
    return this.coursesService.update(req.user.id, updateCourseDto, +course_id);
  }

  @UseInterceptors(InstructorAuthInterceptor)
  @UseGuards(InstructorJwtAuthGuard)
  @Patch('thumbnail/:course_id')
  @UseInterceptors(FileInterceptor("thumbnail"))
  async updateThumbnail(@UploadedFile() file: Express.Multer.File ,@Param('course_id') course_id: string, @Request() req) {
    return this.coursesService.updateThumbnail(req.user.id, file ,+course_id);
  }


  @UseInterceptors(InstructorAuthInterceptor)
  @UseGuards(InstructorJwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }

}
