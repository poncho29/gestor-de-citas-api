import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { Transform, TransformFnParams } from 'class-transformer';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 }) // Asegura que el número tenga máximo 2 decimales
  @Min(0)
  @Transform(({ value }: TransformFnParams) => parseFloat(value.toFixed(2))) // Redondea a 2 decimales
  price: number;

  @IsNumber()
  @IsInt()
  @Min(1)
  duration: number;

  @IsString()
  @IsOptional()
  deleted_at?: string;
}
