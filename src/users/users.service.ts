import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, ILike, Repository } from 'typeorm';

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
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está registrado.');
      }

      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
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
    const user = await this.userRepository.findOneBy({ id });

    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);

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
    return await this.userRepository.softRemove(user);
  }
}
