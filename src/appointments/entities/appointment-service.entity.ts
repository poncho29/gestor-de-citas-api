import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Service } from '../../services/entities/service.entity';
import { Appointment } from './appointment.entity';

@Entity('appointment_services')
export class AppointmentService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  appointment_id: string;

  @Column({ type: 'uuid' })
  service_id: string;

  // Relations
  @ManyToOne(
    () => Appointment,
    (appointment) => appointment.appointmentServices,
  )
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @ManyToOne(() => Service, (service) => service.appointmentServices)
  @JoinColumn({ name: 'service_id' })
  service: Service;
}
