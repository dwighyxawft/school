import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { InterviewService } from '../services/interview.service';
import { CreateInterviewDto } from '../dto/create-interview.dto';
import { UpdateInterviewDto } from '../dto/update-interview.dto';
import { AdminJwtAuthGuard } from 'src/resources/auth/admin/admin-jwt-auth.guard';
import { AdminAuthInterceptor } from 'src/interceptors/admin-auth.interceptor';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @UseGuards(AdminJwtAuthGuard)
  @UseInterceptors(AdminAuthInterceptor)
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createInterviewDto: CreateInterviewDto, @Request() req) {
    return this.interviewService.create(req.user.id, createInterviewDto);
  }

  @Get()
  findAll() {
    return this.interviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewService.findOne(+id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @UseInterceptors(AdminAuthInterceptor)
  @UsePipes(ValidationPipe)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInterviewDto: UpdateInterviewDto, @Request() req) {
    return this.interviewService.update(req.user.id, updateInterviewDto, +id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @UseInterceptors(AdminAuthInterceptor)
  @UsePipes(ValidationPipe)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.interviewService.remove(req.user.id, +id);
  }
}
