import { PartialType } from '@nestjs/swagger';
import { CreateObjectiveQuestionDto } from './create-objective-question.dto';


export class UpdateObjectiveQuestionDto extends PartialType(CreateObjectiveQuestionDto) {}
