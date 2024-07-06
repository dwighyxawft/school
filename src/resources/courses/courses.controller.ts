import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InstructorJwtAuthGuard } from '../auth/instructor/instructor-jwt-auth.guard';
import { InstructorAuthInterceptor } from 'src/interceptors/instructor-auth.interceptor';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}
