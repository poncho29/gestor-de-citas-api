import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, ILike, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dtos';

import { handleDBErrors } from '../helpers';

import { ROLE_PERMISSIONS, ValidRoles } from '../auth/interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User | null = null, createUserDto: CreateUserDto) {
    const { password, roles, ...userData } = createUserDto;

    if (user && roles) {
      this.validateRoles(user.roles as ValidRoles[], roles as ValidRoles[]);
    }

    try {
      const userExists = await this.userRepository.findOne({
        where: { email: userData.email },
        withDeleted: true,
        select: { id: true, email: true, deleted_at: true },
      });

      if (userExists) {
        if (userExists.deleted_at)
          throw new ConflictException('El usuario existe pero esta inactivo.');

        throw new NotFoundException('Ya existe un usuario con ese email.');
      }

      const newUser = this.userRepository.create({
        ...userData,
        roles: roles as ValidRoles[],
        password: bcrypt.hashSync(password, 10),
        enterprise: user?.enterprise,
      });

      await this.userRepository.save(newUser);

      delete newUser.created_at;
      delete newUser.updated_at;
      delete newUser.deleted_at;
      delete newUser.password;

      return newUser;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll(user: User, pagination: PaginationDto) {
    const { limit = 10, offset = 0, search = '' } = pagination;

    const findOptions: FindManyOptions<User> = {
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
      where: {
        enterprise: { id: user?.enterprise?.id },
        id: Not(user.id),
      },
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
      select: { id: true, email: true, deleted_at: true },
    });

    if (!user)
      throw new NotFoundException(`El usuario con email ${email} no existe.`);

    if (user.deleted_at)
      throw new NotFoundException(
        `El usuario con email ${email} esta inactivo.`,
      );

    delete user.email;
    delete user.deleted_at;

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

  // Helpers
  private validateRoles(
    creatorRoles: ValidRoles[],
    newUserRoles: ValidRoles[],
  ) {
    // Determinamos el nivel más alto de rol del creador
    const isCreatorSuperAdmin = creatorRoles.includes(ValidRoles.SUPER_ADMIN);
    const isCreatorAdmin = creatorRoles.includes(ValidRoles.ADMIN);

    // Obtenemos los roles permitidos según el rol del creador
    const allowedRoles = isCreatorSuperAdmin
      ? ROLE_PERMISSIONS[ValidRoles.SUPER_ADMIN]
      : isCreatorAdmin
        ? ROLE_PERMISSIONS[ValidRoles.ADMIN]
        : [];

    // Verificamos si todos los roles nuevos están permitidos
    const hasInvalidRoles = newUserRoles.some(
      (role) => !allowedRoles.includes(role),
    );

    if (hasInvalidRoles) {
      throw new ForbiddenException(
        `No tienes permisos para asignar algunos de los roles proporcionados.
        Roles permitidos: ${allowedRoles.join(', ')}`,
      );
    }
  }
}
