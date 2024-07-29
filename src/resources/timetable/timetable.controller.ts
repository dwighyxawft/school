import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { InstructorJwtAuthGuard } from '../auth/instructor/instructor-jwt-auth.guard';
import { InstructorAuthInterceptor } from 'src/interceptors/instructor-auth.interceptor';

@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @UseGuards(InstructorJwtAuthGuard)
  @UseInterceptors(InstructorAuthInterceptor)
  @Post(":course_id")
  create(@Body() createTimetableDto: CreateTimetableDto, @Request() req, @Param("course_id") course_id: string) {
    return this.timetableService.create(createTimetableDto, req.user.id, +course_id);
  }

  @Get()
  findAll() {
    return this.timetableService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timetableService.findOne(+id);
  }

  @UseGuards(InstructorJwtAuthGuard)
  @UseInterceptors(InstructorAuthInterceptor)
  @Get('instructor')
  getTableByInstructors(@Request() req) {
    return this.timetableService.getTimetbleByInstructor(req.user.id);
  }

  @UseGuards(InstructorJwtAuthGuard)
  @UseInterceptors(InstructorAuthInterceptor)
  @Get('courses/:id')
  getTableByCourses(@Request() req, @Param("id") id: string) {
    return this.timetableService.getTimetableByCourses(req.user.id, +id);
  }

  @UseGuards(InstructorJwtAuthGuard)
  @UseInterceptors(InstructorAuthInterceptor)
  @Patch(':course_id/:timetable_id')
  update(@Param('course_id') course_id: string, @Param('timetable_id') timetable_id: string, @Body() updateTimetableDto: UpdateTimetableDto, @Request() req) {
    return this.timetableService.update(req.user.id, +course_id, updateTimetableDto, +timetable_id);
  }

  @UseGuards(InstructorJwtAuthGuard)
  @UseInterceptors(InstructorAuthInterceptor)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timetableService.remove(+id);
  }

  
}
