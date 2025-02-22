import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
  @IsUUID()
  @IsNotEmpty()
  enterprise_id: string;

  @IsUUID()
  @IsNotEmpty()
  plan_id: string;

  @IsString()
  @IsOptional()
  deleted_at?: string;
}
