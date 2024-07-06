import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UserJwtAuthGuard } from './user/user-jwt-auth.guard';
import { AuthInterceptor } from 'src/interceptors/auth.interceptor';
import { Response } from 'express';
import { InstructorJwtAuthGuard } from './instructor/instructor-jwt-auth.guard';
import { AdminJwtAuthGuard } from './admin/admin-jwt-auth.guard';
import { InstructorAuthInterceptor } from 'src/interceptors/instructor-auth.interceptor';
import { AdminAuthInterceptor } from 'src/interceptors/admin-auth.interceptor';
import { NoAuthGuard } from './no-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(NoAuthGuard)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Request() req, @Res() res: Response): Promise<any> {
    const token = await this.authService.generateToken(req.user);
    res.cookie('access_token', token.access_token, { httpOnly: true });
    return res.send({ token: token.access_token });
  }

  @UseGuards(InstructorJwtAuthGuard)
  @UseInterceptors(InstructorAuthInterceptor)
  @Get('instructor')
  public async instructor_loggedin(@Request() req): Promise<any> {
    return req.user;
  }

  
  @UseGuards(AdminJwtAuthGuard)
  @UseInterceptors(AdminAuthInterceptor)
  @Get('admin')
  public async admin_loggedin(@Request() req): Promise<any> {
    return req.user;
  }
  @UseGuards(UserJwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Get('user')
  public async user(@Request() req): Promise<any> {
    return req.user;
  }

  

  @Post("instructor/login")
  public async instructor(@Body() body: {email: string, password: string}, @Res() res: Response){
    const instructor = await this.authService.getInstructorCreds(body.email, body.password); 
    const token = await this.authService.generateToken(instructor);
    res.cookie('instructor_token', token.access_token, { httpOnly: true });
    return res.send({ token: token.access_token });
  }

  @Post("admin/login")
  public async admin(@Body() body: {email: string, password: string}, @Res() res: Response){
    const admin = await this.authService.getAdminCreds(body.email, body.password); 
    const token = await this.authService.generateToken(admin);
    res.cookie('admin_token', token.access_token, { httpOnly: true });
    return res.send({ token: token.access_token });
  }

}
