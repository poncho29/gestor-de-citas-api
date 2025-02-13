import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  MaxLength,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  phone: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener una letra mayúscula, una minúscula y un número.',
  })
  password: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  roles?: string[];
}
