import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersModule } from '../customers/customers.module';
import { ServicesModule } from '../services/services.module';
import { AuthModule } from '../auth/auth.module';

import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { RemindersService } from './cron/reminders.service';

import { AppointmentService } from './entities/appointment-service.entity';
import { Appointment } from './entities/appointment.entity';
import { Reminder } from './entities/reminder.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Appointment, Reminder, AppointmentService]),
    AuthModule,
    ServicesModule,
    CustomersModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, RemindersService],
})
export class AppointmentsModule {}
