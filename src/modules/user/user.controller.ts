import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post("email")
  getUserByEmail(@Body() body: { email: string }) {
    return this.userService.getUserByEmail(body.email);
  }

  @Post("verify")
  verifyUserByEmail(@Body() body: { email: string }) {
    return this.userService.sendVerification(body.email);
  }

  @Post("reset/password")
  resetPassword(@Body() body: { email: string }) {
    return this.userService.resetPassword(body.email);
  }

  @Get("verification/:id/:token")
  userVerification(@Param("id") id: string, @Param("token") token: string){
    return this.userService.userVerification(+id, token);
  }

  @Get("reset/password/:id/:token")
  resetPasswordDefault(@Param("id") id: string, @Param("token") token: string){
    return this.userService.resetPasswordDefault(+id, token);
  }

  @Patch("update/reset/:id")
  @UsePipes(ValidationPipe)
  updateResetPassword(@Param("id") id: string, @Body() body: UpdateUserDto){
    return this.userService.updateResetPassword(+id, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
