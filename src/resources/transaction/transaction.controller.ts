import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserJwtAuthGuard } from '../auth/user/user-jwt-auth.guard';
import { AuthInterceptor } from 'src/interceptors/auth.interceptor';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}


  @UseGuards(UserJwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Post("create")
  @UsePipes(ValidationPipe)
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    return this.transactionService.create(createTransactionDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
