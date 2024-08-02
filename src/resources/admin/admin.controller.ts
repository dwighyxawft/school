import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ValidationPipe,
  UsePipes,
  UseInterceptors,
  Request,
  UploadedFile,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminJwtAuthGuard } from '../auth/admin/admin-jwt-auth.guard';
import { AdminAuthInterceptor } from 'src/interceptors/admin-auth.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerAdminConfig } from 'src/config/multer.config';
import { join } from 'path';
import { FirebaseService } from 'src/providers/firebase/firebase.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService, private firebase: FirebaseService) {}

  @Post('register')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get("verification/:id/:token")
  verifyAdmin(@Param("id") id: string, @Param("token") token: string){
    return this.adminService.adminVerification(+id, token);
  }

  @Post("verify")
  verifyUserByEmail(@Body() body: { email: string }) {
    return this.adminService.sendVerification(body.email);
  }

  @Post('reset/password')
  resetPassword(@Body() body: { email: string }) {
    return this.adminService.resetPassword(body.email);
  }

  @Get('reset/password/:id/:token')
  resetPasswordDefault(@Param('id') id: string, @Param('token') token: string) {
    return this.adminService.resetPasswordDefault(+id, token);
  }

  @Patch('update/reset/:id')
  @
  UsePipes(ValidationPipe)
  updateResetPassword(@Param('id') id: string, @Body() body: UpdateAdminDto) {
    return this.adminService.updateResetPassword(+id, body);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @UseInterceptors(AdminAuthInterceptor)
  @Patch('personal/settings')
  update(@Request() req ,@Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(req.user.id, updateAdminDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @UseInterceptors(AdminAuthInterceptor)
  @Patch('email/settings')
  updateEmail(@Request() req ,@Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateEmail(req.user.id, updateAdminDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @UseInterceptors(AdminAuthInterceptor)
  @Patch('phone/settings')
  updatePhone(@Request() req ,@Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updatePhone(req.user.id, updateAdminDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @UseInterceptors(AdminAuthInterceptor)
  @Patch('password/settings')
  updatePassword(@Request() req ,@Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updatePassword(req.user.id, updateAdminDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @UseInterceptors(AdminAuthInterceptor)
  @UseInterceptors(FileInterceptor("image"))
  @Patch('image/settings')
  async updateImage(@Request() req , @UploadedFile() file: Express.Multer.File) {
    return this.adminService.updateImage(req.user.id, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
