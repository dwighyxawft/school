import { PartialType } from '@nestjs/swagger';
import { CreatePracticalProjectDto } from './create-practical-project.dto';


export class UpdatePracticalProjectDto extends PartialType(CreatePracticalProjectDto) {}
