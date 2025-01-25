import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AppointmentService } from '../../appointments/entities/appointment-service.entity';

@Entity({ name: 'services' })
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'decimal', default: 0 })
  duration: number;

  @Column({ type: 'decimal', default: 0 })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  // Relations
  @OneToMany(
    () => AppointmentService,
    (appointmentService) => appointmentService.service,
  )
  appointmentServices: AppointmentService[];
}
