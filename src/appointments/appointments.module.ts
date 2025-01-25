import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';

import { AppointmentService } from './entities/appointment-service.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Service } from '../services/entities/service.entity';
import { Appointment } from './entities/appointment.entity';
import { Reminder } from './entities/reminder.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      Reminder,
      Service,
      AppointmentService,
      Customer,
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
