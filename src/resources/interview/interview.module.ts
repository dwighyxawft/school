import { Module } from '@nestjs/common';
import { InterviewService } from './services/interview.service';
import { InterviewController } from './controllers/interview.controller';
import { InterviewQuestionService } from './services/question.service';
import { InterviewAnswerService } from './services/answer.service';
import { InterViewQuestionController } from './controllers/question.controller';
import { InterviewAnswerController } from './controllers/answer.controller';
import { AdminModule } from '../admin/admin.module';
import { InstructorModule } from '../instructor/instructor.module';
import { PrismaModule } from 'database/prisma/prisma.module';
import { OpenaiModule } from 'src/providers/openai/openai.module';

@Module({
  controllers: [InterviewController, InterViewQuestionController, InterviewAnswerController],
  providers: [InterviewService, InterviewAnswerService, InterviewQuestionService],
  imports: [AdminModule, InstructorModule, PrismaModule, OpenaiModule]
})
export class InterviewModule {}
