import { PartialType } from '@nestjs/swagger';
import { CreateTheoryQuestionDto } from './create-theory-question.dto';


export class UpdateTheoryQuestionDto extends PartialType(CreateTheoryQuestionDto) {}
