import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';

import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

import { Customer } from './entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), AuthModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [TypeOrmModule, CustomersService],
})
export class CustomersModule {}
