import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';

@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorService.register(createInstructorDto);
  }

  @Get()
  findAll() {
    return this.instructorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instructorService.findOne(+id);
  }

  @Post('email')
  getInstructorByEmail(@Body() instructor: {email: string}) {
    return this.instructorService.getInstructorByEmail(instructor.email);
  }

  @Get("verification/:id/:token")
  verifyInstructor(@Param("id") id: string, @Param("token") token: string){
    return this.instructorService.instructVerification(+id, token);
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstructorDto: UpdateInstructorDto) {
    return this.instructorService.update(+id, updateInstructorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instructorService.remove(+id);
  }
}
