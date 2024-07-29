import { PartialType } from '@nestjs/swagger';
import { CreateTheoryAnswerDto } from './create-theory-answer.dto';

export class UpdateTheoryAnswerDto extends PartialType(CreateTheoryAnswerDto) {}
