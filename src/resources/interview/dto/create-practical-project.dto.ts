import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePracticalProjectDto{

    @IsString()
    @IsNotEmpty()
    projectDetails: string;

    @IsString()
    @IsOptional()
    fileLink?: string;

    @IsString()
    @IsOptional()
    submission?: string;

    @IsNumber()
    @IsOptional()
    score?: number;

    @IsBoolean()
    @IsNotEmpty()
    passed: boolean;
}