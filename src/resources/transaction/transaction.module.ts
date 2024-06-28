import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [UserModule]
})
export class TransactionModule {}
