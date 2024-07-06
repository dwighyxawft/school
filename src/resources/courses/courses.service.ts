import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'database/prisma/prisma.service';
import { InstructorService } from '../instructor/instructor.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService, private instructService: InstructorService){}
  public async create(course: CreateCourseDto, id: number) {
    const instructor = await this.instructService.findOne(id);
    if(!instructor) throw new HttpException("Instructor not found", HttpStatus.NOT_FOUND);
    
  }

  public async findAll() {
    return this.prisma.course.findMany({ include: {
      users: true,
      timetable: true,
      transactions: true
    }})
  }

  public async findOne(id: number) {
    return this.prisma.course.findUnique({ where: { id }, include: {
      users: true,
      timetable: true,
      transactions: true
    }})
  }

  public async findCoursesByInstructor(id: number) {
    return this.prisma.course.findMany({ where: { instructorId: id }, include: {
      users: true,
      timetable: true,
      transactions: true
    }})
  }

  public async findCoursesByDuration(duration: number) {
    return this.prisma.course.findMany({ where: { duration }, include: {
      users: true,
      timetable: true,
      transactions: true
    }})
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
