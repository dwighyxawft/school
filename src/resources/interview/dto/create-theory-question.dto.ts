import { IsNotEmpty, IsString } from "class-validator";

export class CreateTheoryQuestionDto{

    @IsString()
    @IsNotEmpty()
    text: string;

    @IsString()
    @IsNotEmpty()
    answer: string;
}