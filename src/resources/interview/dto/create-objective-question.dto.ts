import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateObjectiveQuestionDto{

    @IsString()
    @IsNotEmpty()
    text: string;

    @IsString()
    @IsNotEmpty()
    option1: string;

    @IsString()
    @IsNotEmpty()
    option2: string;

    @IsString()
    @IsNotEmpty()
    option3: string;

    @IsString()
    @IsNotEmpty()
    option4: string;

    @IsNumber()
    @IsNotEmpty()
    correctOption: number;
}