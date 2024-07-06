import { Controller, Get, Request, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { UserJwtAuthGuard } from './resources/auth/user/user-jwt-auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(UserJwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Get("logout")
  logout(@Request() req, @Res({passthrough: true}) res: Response) {
    return this.appService.logout(req.user.id, res);
  }
}
