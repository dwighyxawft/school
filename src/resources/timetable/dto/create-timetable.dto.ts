import { IsDate, IsEnum, IsISO8601, IsNotEmpty, IsNumber } from "class-validator";
import { Days } from "src/enums/days.enum";

export class CreateTimetableDto {

    @IsNumber()
    instructorId: number;

    @IsNumber()
    courseId: number;

    @IsISO8601({strict: true})
    start: string;

    @IsISO8601({strict: true})
    end: string;

    @IsNotEmpty()
    @IsNumber()
    duration: number;

    @IsEnum(Days)
    day: Days;

}
