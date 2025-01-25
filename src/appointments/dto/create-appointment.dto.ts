import { IsDateString, IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsDateString()
  @IsNotEmpty()
  start_time: Date;

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
  @IsDateString()
  @IsNotEmpty()
  reminder_time: Date;
}
