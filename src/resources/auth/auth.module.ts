import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserJwtStrategy } from './user/user-jwt.strategy';
import { InstructorModule } from '../instructor/instructor.module';
import { AdminModule } from '../admin/admin.module';
import { InstructorJwtStrategy } from './instructor/instructor-jwt.strategy';
import { AdminJwtStrategy } from './admin/admin-jwt.strategy';
import { UserModule } from '../user/user.module';
import { NoAuthGuard } from './no-auth.guard';

@Module({
  providers: [
    AuthService,
    LocalStrategy,
    UserJwtStrategy,
    InstructorJwtStrategy,
    AdminJwtStrategy,
    NoAuthGuard,
  ],
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    InstructorModule,
    AdminModule,
  ],
})
export class AuthModule {}
