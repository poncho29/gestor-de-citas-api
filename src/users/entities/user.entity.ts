import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Customer } from '../../customers/entities/customer.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => Customer, (customer) => customer.user)
  customers: Customer[];
}
