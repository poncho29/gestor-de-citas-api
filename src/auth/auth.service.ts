import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';

import { LoginAuthDto } from './dto/login-auth.dto';

import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
    });

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
