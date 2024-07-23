import { Module } from '@nestjs/common';
import { InterviewService } from './services/interview.service';
import { InterviewController } from './controllers/interview.controller';

@Module({
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
