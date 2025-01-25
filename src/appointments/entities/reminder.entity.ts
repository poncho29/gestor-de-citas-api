import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Appointment } from './appointment.entity';

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  reminder_time: Date;

  @Column({ type: 'boolean', default: false })
  is_sent: boolean;

  @Column({ type: 'uuid' })
  appointment_id: string;

  // Relations
  @ManyToOne(() => Appointment, (appointment) => appointment.reminders)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;
}
