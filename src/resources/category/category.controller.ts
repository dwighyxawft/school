import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AdminJwtAuthGuard } from '../auth/admin/admin-jwt-auth.guard';
import { AdminAuthInterceptor } from 'src/interceptors/admin-auth.interceptor';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AdminJwtAuthGuard)
  @UseInterceptors(AdminAuthInterceptor)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    return this.categoryService.create(createCategoryDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }
  
  @UseGuards(AdminJwtAuthGuard)
  @UseInterceptors(AdminAuthInterceptor)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Request() req) {
    return this.categoryService.update(req.user.id, updateCategoryDto, +id);
  }
  
  @UseGuards(AdminJwtAuthGuard)
  @UseInterceptors(AdminAuthInterceptor)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.categoryService.remove(req.user.id, +id);
  }
}
