import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
  UseInterceptors,
  Request,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserJwtAuthGuard } from '../auth/user/user-jwt-auth.guard';
import { AuthInterceptor } from 'src/interceptors/auth.interceptor';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerUserConfig } from 'src/config/multer.config';
import { join } from 'path';
import { FirebaseService } from 'src/providers/firebase/firebase.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private firebase: FirebaseService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post('email')
  getUserByEmail(@Body() body: { email: string }) {
    return this.userService.getUserByEmail(body.email);
  }

  @Post('phone')
  getUserByPhone(@Body() body: { phone: string }) {
    return this.userService.getUserByPhone(body.phone);
  }

  @Post('verify')
  verifyUserByEmail(@Body() body: { email: string }) {
    return this.userService.sendVerification(body.email);
  }

  @Post('reset/password')
  resetPassword(@Body() body: { email: string }) {
    return this.userService.resetPassword(body.email);
  }

  @Get('verification/:id/:token')
  userVerification(@Param('id') id: string, @Param('token') token: string) {
    return this.userService.userVerification(+id, token);
  }

  @UseGuards(UserJwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Patch('verify/phone')
  verifyPhone(@Request() req ,@Body() body: {token: string}) {
    return this.userService.verifyPhone(req.user.id, body.token);
  }

  @Get('reset/password/:id/:token')
  resetPasswordDefault(@Param('id') id: string, @Param('token') token: string) {
    return this.userService.resetPasswordDefault(+id, token);
  }

  @Patch('update/reset/:id')
  @UsePipes(ValidationPipe)
  updateResetPassword(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateResetPassword(+id, body);
  }

  @UseGuards(AuthGuard('google-user'))
  @Get('google')
  public async googleAuth(@Req() req) {}
  
  @UseGuards(AuthGuard('google-user'))
  @UsePipes(ValidationPipe)
  @Get('google/callback')
  public async googleAuthRedirect(
    @Req() req,
    @Res() res: Response
  ) {
    const user: UpdateUserDto = {} as UpdateUserDto;
    const checkMail = await this.userService.googleLoginAndSignup(req, user);
    console.log(checkMail);
    const token = await this.userService.generateToken(checkMail);
    res.cookie('access_token', token.access_token, { httpOnly: true });
    return res.send({ token: token.access_token });
  }
  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(UserJwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Patch('personal/settings')
  update(@Request() req ,@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @UseGuards(UserJwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Patch('email/settings')
  updateEmail(@Request() req ,@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateEmail(req.user.id, updateUserDto);
  }

  @UseGuards(UserJwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Patch('phone/settings')
  updatePhone(@Request() req ,@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updatePhone(req.user.id, updateUserDto);
  }

  @UseGuards(UserJwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Patch('password/settings')
  updatePassword(@Request() req ,@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updatePassword(req.user.id, updateUserDto);
  }

  @UseGuards(UserJwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @UseInterceptors(FileInterceptor("image", multerUserConfig))
  @Patch('image/settings')
  async updateImage(@Request() req , @UploadedFile() image: Express.Multer.File) {
    const filePath = join(__dirname, "..", "..", `uploads/images/users/${image.filename}`);
    const destination = `school/images/users/${image.filename}`;
    const url = await this.firebase.uploadFile(filePath, destination);
    return this.userService.updateImage(req.user.id, filePath, url);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
