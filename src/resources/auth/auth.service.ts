import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { InstructorService } from '../instructor/instructor.service';
import { AdminService } from '../admin/admin.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService, private instructService: InstructorService, private adminService: AdminService, private config: ConfigService){}
    public async validateUserCreds(email: string, password: string){
        const user = await this.userService.getUserByEmail(email);
        if(!user) throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
        if(!(await argon2.verify(user.password, password))) throw new HttpException("Email or Password is incorrect", HttpStatus.UNAUTHORIZED)
        return user;
    }

    public async generateToken(user: any){
        return {
            access_token: await this.jwtService.sign({
                name: user.name,
                sub: user.id
            })
        }
    }

    public async getInstructorCreds(email: string, password: string){
        const instructor = await this.instructService.getInstructorByEmail(email);
        if(!instructor) throw new HttpException("Instructor not found", HttpStatus.NOT_FOUND);
        if(!(await argon2.verify(instructor.password, password))) throw new HttpException("Email or Password Incorrect", HttpStatus.UNAUTHORIZED);
        return instructor;
    }

    public async getAdminCreds(email: string, password: string){
        const admin = await this.adminService.findAdminByEmail(email);
        if(!admin) throw new HttpException("Admin not found", HttpStatus.NOT_FOUND);
        if(!(await argon2.verify(admin.password, password))) throw new HttpException("Email or Password Incorrect", HttpStatus.UNAUTHORIZED);
        return admin;
    }
}
