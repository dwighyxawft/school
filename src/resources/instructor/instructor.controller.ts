import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Req, UseGuards, Res, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { InstructorJwtAuthGuard } from '../auth/instructor/instructor-jwt-auth.guard';
import { InstructorAuthInterceptor } from 'src/interceptors/instructor-auth.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerInstructorConfig } from 'src/config/multer.config';
import { FirebaseService } from 'src/providers/firebase/firebase.service';
import { join } from 'path';

@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService, private firebase: FirebaseService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorService.register(createInstructorDto);
  }

  @Get()
  findAll() {
    return this.instructorService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.instructorService.findOne(+id);
  // }

  @Post('email')
  getInstructorByEmail(@Body() instructor: {email: string}) {
    return this.instructorService.getInstructorByEmail(instructor.email);
  }

  @Get("verification/:id/:token")
  verifyInstructor(@Param("id") id: string, @Param("token") token: string){
    return this.instructorService.instructVerification(+id, token);
  }

  @UseGuards(InstructorJwtAuthGuard)
  @UseInterceptors(InstructorAuthInterceptor)
  @Patch('verify/phone')
  verifyPhone(@Request() req ,@Body() body: {token: string}) {
    return this.instructorService.verifyPhone(req.user.id, body.token);
  }

  @Post('verify')
  sendVerification(@Body() instructor: {email: string}) {
    return this.instructorService.sendVerification(instructor.email);
  }

  @Post("reset/password")
  resetPassword(@Body() body: { email: string }) {
    return this.instructorService.resetPassword(body.email);
  }

  @Get("reset/password/:id/:token")
  resetPasswordDefault(@Param("id") id: string, @Param("token") token: string){
    return this.instructorService.resetPasswordDefault(+id, token);
  }

  @Patch("update/reset/:id")
  @UsePipes(ValidationPipe)
  updateResetPassword(@Param("id") id: string, @Body() body: UpdateInstructorDto){
    return this.instructorService.updateResetPassword(+id, body);
  }

  @UseGuards(AuthGuard("google-instructor"))
  @Get("google")
  public async googleAuth(@Req() req){}

  @UseGuards(AuthGuard("google-instructor"))
  @Get("google/callback")
  @UsePipes(ValidationPipe)
  public async googleAuthRedirect(@Req() req, @Res() res: Response){
    const instructor: UpdateInstructorDto = {} as UpdateInstructorDto;
    const checkMail = await this.instructorService.googleLoginAndSignup(req, instructor);
    console.log(checkMail);
    const token = await this.instructorService.generateToken(checkMail);
    res.cookie('access_token', token.access_token, { httpOnly: true });
    return res.send({ token: token.access_token });
  }

  @UseGuards(InstructorJwtAuthGuard)
  @UseInterceptors(InstructorAuthInterceptor)
  @Patch('personal/settings')
  update(@Request() req ,@Body() updates: UpdateInstructorDto) {
    return this.instructorService.update(req.user.id, updates);
  }

  @UseGuards(InstructorJwtAuthGuard)
  @UseInterceptors(InstructorAuthInterceptor)
  @Patch('email/settings')
  updateEmail(@Request() req ,@Body() updates: UpdateInstructorDto) {
    return this.instructorService.updateEmail(req.user.id, updates);
  }

  @UseGuards(InstructorJwtAuthGuard)
  @UseInterceptors(InstructorAuthInterceptor)
  @Patch('phone/settings')
  updatePhone(@Request() req ,@Body() updates: UpdateInstructorDto) {
    return this.instructorService.updatePhone(req.user.id, updates);
  }

  @UseGuards(InstructorJwtAuthGuard)
  @UseInterceptors(InstructorAuthInterceptor)
  @Patch('phone/settings')
  updatePassword(@Request() req ,@Body() updates: UpdateInstructorDto) {
    return this.instructorService.updatePassword(req.user.id, updates);
  }

  @UseGuards(InstructorJwtAuthGuard)
  @UseInterceptors(InstructorAuthInterceptor)
  @UseInterceptors(FileInterceptor("image", multerInstructorConfig))
  @Patch('image/settings')
  async updateImage(@Request() req ,@UploadedFile() file: Express.Multer.File) {
    const filePath = join(__dirname, "..", "..", `uploads/images/instructors/${file.filename}`);
    const destination = `school/images/instructors/${file.filename}`;
    const url = await this.firebase.uploadFile(filePath, destination);
    return this.instructorService.updateImage(req.user.id, filePath, url);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instructorService.remove(+id);
  }
}
