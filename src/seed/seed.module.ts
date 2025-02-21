import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

import { EnterpriseModule } from '../enterprise/enterprise.module';
import { CustomersModule } from '../customers/customers.module';
import { ServicesModule } from '../services/services.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    EnterpriseModule,
    CustomersModule,
    ServicesModule,
    UsersModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
