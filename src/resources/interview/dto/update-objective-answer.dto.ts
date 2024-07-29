import { PartialType } from '@nestjs/swagger';
import { CreateObjectiveAnswerDto } from './create-objective-answer.dto';

export class UpdateObjectiveAnswerDto extends PartialType(CreateObjectiveAnswerDto) {}
