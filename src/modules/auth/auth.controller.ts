import {
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

}
