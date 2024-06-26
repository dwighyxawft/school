import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from 'src/constants/jwt.constant';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { InstructorModule } from '../instructor/instructor.module';
import { AdminModule } from '../admin/admin.module';


@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  imports: [UserModule, PassportModule, JwtModule.register(jwtOptions), ConfigModule, InstructorModule, AdminModule]
})
export class AuthModule {}
