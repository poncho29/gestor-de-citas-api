import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dtos';

import { handleDBErrors } from '../helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return user;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0, search = '' } = pagination;

    const findOptions: FindManyOptions<User> = {
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
    };

    if (search) {
      findOptions.where = {
        name: ILike(`%${search}%`),
      };
    }

    const [users, total] = await this.userRepository.findAndCount(findOptions);

    return { users, total };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['enterprise'],
      withDeleted: true,
    });

    if (!user) throw new NotFoundException(`Usuario con ID ${id} no existe.`);

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
      select: { id: true, email: true, password: true },
    });

    if (!user)
      throw new NotFoundException(`El usuario con email ${email} no existe.`);

    if (user.deleted_at)
      throw new NotFoundException(
        `El usuario con email ${email} esta inactivo.`,
      );

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      Object.assign(user, updateUserDto);

      return await this.userRepository.save(user);
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);

    return { ok: true, message: 'Usuario eliminado correctamente.' };
  }
}
