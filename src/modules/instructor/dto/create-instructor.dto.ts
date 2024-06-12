import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateInstructorDto {
  @IsNotEmpty()
  @Length(3, 100)
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  major: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  @IsNumber()
  @IsOptional()
  age?: number;

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

  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  courses?: number[];

  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  timetable?: number[];

  @IsBoolean()
  @IsOptional()
  verified?: boolean;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsBoolean()
  @IsOptional()
  access?: boolean;

  @IsBoolean()
  @IsOptional()
  phoned?: boolean;

  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  notifications?: number[];
}
