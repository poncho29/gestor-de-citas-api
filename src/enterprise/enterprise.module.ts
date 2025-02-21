import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';

import { EnterpriseController } from './enterprise.controller';
import { EnterpriseService } from './enterprise.service';

import { Enterprise } from './entities/enterprise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enterprise]), AuthModule],
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
  exports: [TypeOrmModule, EnterpriseService],
})
export class EnterpriseModule {}
