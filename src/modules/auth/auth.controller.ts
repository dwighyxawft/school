import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post("login")
    public async login(@Request() req): Promise<any>{
        return this.authService.generateToken(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get("user")
    public async user(@Request() req): Promise<any>{

    }
}
