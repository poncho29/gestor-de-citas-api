import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Appointment } from '../../appointments/entities/appointment.entity';
import { Enterprise } from '../../enterprise/entities/enterprise.entity';
// import { Customer } from '../../customers/entities/customer.entity';
// import { Service } from '../../services/entities/service.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  // Relations
  @ManyToOne(() => Enterprise, (enterprise) => enterprise.users)
  @JoinColumn()
  enterprise: Enterprise;

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment;

  // @OneToMany(() => Service, (service) => service.user)
  // services: Service[];

  // @OneToMany(() => Customer, (customer) => customer.user)
  // customers: Customer[];

  // Functions
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
