import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AdminModule } from '../admin/admin.module';
import { PrismaModule } from 'database/prisma/prisma.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [AdminModule, PrismaModule],
  exports: [CategoryService]
})
export class CategoryModule {}
