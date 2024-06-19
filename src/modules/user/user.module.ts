import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'database/prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserGoogleStrategy } from './strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from 'src/constants/jwt.constant';

@Module({
  controllers: [UserController],
  providers: [UserService, UserGoogleStrategy],
  imports: [PrismaModule, MailerModule, JwtModule.register(jwtOptions)],
  exports: [UserService]
})
export class UserModule {}
