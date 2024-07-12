import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    @Length(3, 100)
    title: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 250)
    description: string;
}
