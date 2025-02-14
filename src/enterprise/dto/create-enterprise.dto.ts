import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateEnterpriseDto {
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

  @ValidateNested()
  @Type(() => CreateUserDto)
  @IsNotEmpty()
  user: CreateUserDto;

  @IsString()
  @IsOptional()
  deleted_at?: string;
}
