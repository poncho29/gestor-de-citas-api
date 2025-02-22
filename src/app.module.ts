import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { typeOrmConfig } from './config/typeorm.config';

import { AppointmentsModule } from './appointments/appointments.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { CustomersModule } from './customers/customers.module';
import { ServicesModule } from './services/services.module';
import { CommonModule } from './common/common.module';
import { PlansModule } from './plans/plans.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}` || '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    SeedModule,
    AppointmentsModule,
    EnterpriseModule,
    CustomersModule,
    ServicesModule,
    UsersModule,
    AuthModule,
    PlansModule,
    SubscriptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
