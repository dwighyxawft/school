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
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthInterceptor } from 'src/interceptors/auth.interceptor';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Request() req, @Res() res: Response): Promise<any> {
    const token = await this.authService.generateToken(req.user);
    res.cookie('access_token', token.access_token, { httpOnly: true });
    return res.send({ token: token.access_token });
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Get('user')
  public async user(@Request() req): Promise<any> {
    return req.user;
  }

  @Post("instructor/login")
  public async instructor(@Body() body: {email: string, password: string}, @Res() res: Response){
    const instructor = await this.authService.getInstructorCreds(body.email, body.password); 
    const token = await this.authService.generateToken(instructor);
    res.cookie('access_token', token.access_token, { httpOnly: true });
    return res.send({ token: token.access_token });
  }

  @Post("admin/login")
  public async admin(@Body() body: {email: string, password: string}, @Res() res: Response){
    const admin = await this.authService.getAdminCreds(body.email, body.password); 
    const token = await this.authService.generateToken(admin);
    res.cookie('access_token', token.access_token, { httpOnly: true });
    return res.send({ token: token.access_token });
  }

}
