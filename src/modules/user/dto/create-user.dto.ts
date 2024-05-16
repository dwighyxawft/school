import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  image: string;

  @IsOptional()
  @IsString()
  bio?: string;

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
  saves?: number[];

  createdAt: Date;
}
