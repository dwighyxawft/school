import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateObjectiveAnswerDto{

    @IsNumber()
    @IsNotEmpty()
    questionId: number;

    @IsNumber()
    @IsNotEmpty()
    instructorId: number;

    @IsNumber()
    @IsNotEmpty()
    optionPicked: number;
}