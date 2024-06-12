import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Length, Matches } from "class-validator";

export class CreateAdminDto {

    @IsString()
    @IsNotEmpty()
    firstname: string;
    
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsPhoneNumber()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @Length(8, 24)
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message:
        'Password must have 1 uppercase, lowercase letter along with a number and a special character',
    })
    password: string;

    @IsString()
    @Length(8, 24)
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message:
        'Password must have 1 uppercase, lowercase letter along with a number and a special character',
    })
    confirm: string;

    @IsNumber({}, {each: true})
    @IsArray()
    @IsOptional()
    notifications?: number[];

    @IsNumber({}, {each: true})
    @IsArray()
    @IsOptional()
    Instructor?: number[];

    @IsBoolean()
    @IsOptional()
    verified?: boolean;

    @IsBoolean()
    @IsOptional()
    phoned?: boolean;

    @IsString()
    @IsOptional()
    role?: string;
    

}
