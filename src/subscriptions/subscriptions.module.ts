import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnterpriseModule } from '../enterprise/enterprise.module';
import { PlansModule } from '../plans/plans.module';
import { AuthModule } from '../auth/auth.module';

import { Subscription } from './entities/subscription.entity';

import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    AuthModule,
    EnterpriseModule,
    PlansModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsModule, SubscriptionsService],
})
export class SubscriptionsModule {}
