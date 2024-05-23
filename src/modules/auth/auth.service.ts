import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService){}
    public async validateUserCreds(email: string, password: string){
        const user = await this.userService.getUserByEmail(email);
        if(!user) throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
        const isMatch = await argon2.verify(user.password, password);
        if(!isMatch) throw new HttpException("Email or Password is incorrect", HttpStatus.UNAUTHORIZED)
        return user;
    }

    public async generateToken(user: any){
        return {
            access_token: this.jwtService.sign({
                name: user.name,
                sub: user.id
            })
        }
    }
}
