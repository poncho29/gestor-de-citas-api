import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

import { EnterpriseController } from './enterprise.controller';
import { EnterpriseService } from './enterprise.service';

import { Enterprise } from './entities/enterprise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enterprise]), AuthModule, UsersModule],
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
})
export class EnterpriseModule {}
