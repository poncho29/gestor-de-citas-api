import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Enterprise } from '../../enterprise/entities/enterprise.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { AppointmentService } from './appointment-service.entity';
import { Reminder } from './reminder.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ type: 'timestamptz' })
  start_time: Date;

  @Column({ type: 'timestamptz' })
  end_time: Date;

  @Column({ type: 'uuid' })
  customer_id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  // Relations
  @ManyToOne(() => Enterprise, (enterprise) => enterprise.appointments)
  enterprise: Enterprise;

  @ManyToOne(() => User, (user) => user.appointments, {
    eager: true,
  })
  user: User;

  @ManyToOne(() => Customer, (customer) => customer.appointments)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => Reminder, (reminder) => reminder.appointment, {
    cascade: true,
  })
  reminders: Reminder[];

  @OneToMany(
    () => AppointmentService,
    (appointmentService) => appointmentService.appointment,
    { cascade: true },
  )
  appointmentServices: AppointmentService[];
}
