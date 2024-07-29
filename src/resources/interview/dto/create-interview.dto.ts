import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Phase } from "src/enums/phase.enum";
import { Status } from "src/enums/status.enum";
import { Type } from "src/enums/type.enum";

export class CreateInterviewDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    instructorId: number;

    @IsEnum(Type)
    type: Type;

    @IsEnum(Phase)
    phase: Phase;

    @IsEnum(Status)
    status: Status;
}