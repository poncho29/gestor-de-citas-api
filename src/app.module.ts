import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { typeOrmConfig } from './config/typeorm.config';

import { CommonModule } from './common/common.module';
import { ServicesModule } from './services/services.module';
import { CustomersModule } from './customers/customers.module';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { EnterpriseModule } from './enterprise/enterprise.module';

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
    ServicesModule,
    CustomersModule,
    UsersModule,
    AppointmentsModule,
    AuthModule,
    EnterpriseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
