import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';

import { Plan } from './entities/plan.entity';

import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plan]), AuthModule],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [TypeOrmModule, PlansService],
})
export class PlansModule {}
