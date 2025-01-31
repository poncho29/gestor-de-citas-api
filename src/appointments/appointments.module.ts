import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { RemindersService } from './cron/reminders.service';

import { AppointmentService } from './entities/appointment-service.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Service } from '../services/entities/service.entity';
import { Appointment } from './entities/appointment.entity';
import { Reminder } from './entities/reminder.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Appointment,
      Reminder,
      Service,
      AppointmentService,
      Customer,
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, RemindersService],
})
export class AppointmentsModule {}
