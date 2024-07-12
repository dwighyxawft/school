import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AdminService } from '../admin/admin.service';
import { PrismaService } from 'database/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService, private adminService: AdminService){}
  public async create(category: CreateCategoryDto, id: number) {
    const admin = await this.adminService.findOne(id);
    if(!admin) throw new HttpException("Admin not found", HttpStatus.NOT_FOUND);
    return this.prisma.category.create({ data: {
      name: category.title,
      description: category.description
    }})
  }

  public async findAll() {
    return this.prisma.category.findMany({ include: {
      courses: true
    }})
  }

  public async findOne(id: number) {
    return this.prisma.category.findUnique({ where: { id }, include: {
      courses: true
    }})
  }

  public async update(id: number, category: UpdateCategoryDto, course_id: number) {
    const admin = await this.adminService.findOne(id);
    if(!admin) throw new HttpException("Admin not found", HttpStatus.NOT_FOUND);
    return this.prisma.category.update({ where: { id: course_id }, data: {
      name: category.title,
      description: category.description
    }})
  }

  public async remove(id: number, course_id: number) {
    const admin = await this.adminService.findOne(id);
    if(!admin) throw new HttpException("Admin not found", HttpStatus.NOT_FOUND);
    return this.prisma.category.delete({where: {id: course_id}})
  }
}
