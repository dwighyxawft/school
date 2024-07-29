import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTheoryAnswerDto{

    @IsNumber()
    @IsNotEmpty()
    questionId: number;

    @IsNumber()
    @IsNotEmpty()
    instructorId: number;

    @IsString()
    @IsNotEmpty()
    answer: string;
}