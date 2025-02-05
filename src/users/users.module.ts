import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
