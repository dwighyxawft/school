import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Length, isNumber } from "class-validator";

export class CreateCourseDto {

    @IsNotEmpty()
    @IsString()
    @Length(3, 100)
    title: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 300)
    description: string;

    @IsNumber()
    @IsOptional()
    instructorId?: number;

    @IsNumber()
    @IsOptional()
    categoryId?: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    duration: number;

    @IsDate()
    @IsNotEmpty()
    start: Date;

    @IsDate()
    @IsNotEmpty()
    end: Date;

    @IsString()
    @IsOptional()
    thumbnail?: string | "course.jpg";

    @IsNumber()
    @IsNotEmpty()
    enrollment_limit: number;

    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    users?: number[];

    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    timetable?: number[];

    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    transactions?: number[];
}
