import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'database/prisma/prisma.service';
import { InstructorService } from '../instructor/instructor.service';
import { CategoryService } from '../category/category.service';
import { unlink } from 'fs';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService, private instructService: InstructorService, private categoryService: CategoryService){}
  public async create(course: CreateCourseDto, id: number) {
    const instructor = await this.instructService.findOne(id);
    const category = await this.categoryService.findOne(course.categoryId);
    if(!instructor) throw new HttpException("Instructor not found", HttpStatus.NOT_FOUND);
    if(instructor && !instructor.access) throw new HttpException("Instructor not approved", HttpStatus.FORBIDDEN);
    if(!category) throw new HttpException("Category Not Found", HttpStatus.BAD_REQUEST);
    if(instructor.courses.length == 3) throw new HttpException("Courses limit reached", HttpStatus.BAD_REQUEST)
    course.instructorId = instructor.id;
    return this.prisma.course.create({ data: {
      title: course.title,
      description: course.description,
      instructorId: course.instructorId,
      price: course.price,
      duration: course.duration,
      start: course.start,
      end: course.end,
      categoryId: course.categoryId,
      enrollment_limit: course.enrollment_limit,
    }})
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

  public async update(id: number, course: UpdateCourseDto, course_id: number) {
    const instructor = await this.instructService.findOne(id);
    if(!instructor) throw new HttpException("Instructor not found", HttpStatus.NOT_FOUND);
    if(instructor && !instructor.access) throw new HttpException("Instructor not approved", HttpStatus.FORBIDDEN);
    if(course.categoryId){
      const category = await this.categoryService.findOne(course.categoryId);
      if(!category) throw new HttpException("Category Not Found", HttpStatus.BAD_REQUEST)
    }
    const checkCourse = await this.findOne(course_id);
    course.instructorId = instructor.id;
    if(!checkCourse) throw new HttpException("Course not found", HttpStatus.BAD_REQUEST)
    return await this.prisma.course.update({ where: { id: course_id }, data: {
      title: course.title,
      description: course.description,
      instructorId: course.instructorId,
      price: course.price,
      duration: course.duration,
      start: course.start,
      end: course.end,
      categoryId: course.categoryId,
      enrollment_limit: course.enrollment_limit,
    }})
  }

  public async updateThumbnail(id: number, file: string, url: string , course_id: number){
    const instructor = await this.instructService.findOne(id);
    if(!instructor) throw new HttpException("Instructor not found", HttpStatus.NOT_FOUND);
    if(instructor && !instructor.access) throw new HttpException("Instructor not approved", HttpStatus.FORBIDDEN);
    await unlink(file, (err) => {
      console.error(err);
    });
    return this.prisma.course.update({ where: { id: course_id }, data: {
      thumbnail: file
    }})
  }

  public async remove(id: number) {
    return this.prisma.course.delete({ where: { id }});
  }
}
