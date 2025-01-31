import { IsNotEmpty, IsUUID, IsArray, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  start_time: string;

  @IsArray()
  @IsUUID('4', { each: true }) // Valida que cada elemento del arreglo sea un UUID
  @IsNotEmpty()
  service_ids: string[]; // Arreglo de IDs de servicios

  @IsUUID()
  @IsNotEmpty()
  customer_id: string;

  @IsNotEmpty()
  reminders: ReminderDto[];
}

export class ReminderDto {
  @IsString()
  @IsNotEmpty()
  reminder_time: Date;
}
