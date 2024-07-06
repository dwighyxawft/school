import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from 'database/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private userService: UserService, private prisma: PrismaService){}
  public async create(transaction: CreateTransactionDto, id: number) {
    const user = await this.userService.findOne(id);
    if(!user) throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    transaction.userId = id;

  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
