import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

// import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// import { User } from '../users/entities/user.entity';

import { UsersService } from '../users/users.service';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,

    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    delete user.created_at;
    delete user.updated_at;
    delete user.deleted_at;

    return {
      ...user,
      token: this.getJwtToken({ email: user.email }),
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const user = await this.userService.findOneByEmail(email);

    if (!user) throw new UnauthorizedException('Credenciales no validas');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales no validas');

    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({ email: user.email }),
    };
  }

  getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
