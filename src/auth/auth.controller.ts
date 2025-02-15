import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';

import { User } from '../users/entities/user.entity';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

import { Auth, GetUser } from './decorators';

import { ValidRoles } from './interfaces';

const ADMIN_ROLES = [ValidRoles.SUPER_ADMIN, ValidRoles.ADMIN];

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Auth(...ADMIN_ROLES)
  register(@GetUser() user: User, @Body() createUserDto: CreateUserDto) {
    return this.authService.register(user, createUserDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
}
