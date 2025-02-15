import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, ILike, Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Service } from './entities/service.entity';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationDto } from '../common/dtos';

import { handleDBErrors } from '../helpers';

import { ValidRoles } from '../auth/interfaces';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(user: User, createServiceDto: CreateServiceDto) {
    try {
      const existingService = await this.serviceRepository.findOne({
        where: {
          name: createServiceDto.name.toLowerCase().trim(),
          enterprise: { id: user?.enterprise?.id },
        },
      });

      if (existingService)
        throw new ConflictException('Ya existe un servicio con ese nombre');

      const service = this.serviceRepository.create({
        ...createServiceDto,
        user_id: user.id,
        enterprise: user.enterprise,
      });
      return await this.serviceRepository.save(service);
    } catch (error) {
      handleDBErrors(error, { message: 'un servicio', field: 'nombre' });
    }
  }

  async findAll(user: User, pagination: PaginationDto) {
    const { limit = 10, offset = 0, search = '', byUserId = '' } = pagination;

    const findOptions: FindManyOptions<Service> = {
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
      where: {
        enterprise: { id: user?.enterprise?.id },
      },
    };

    if (user.roles.includes(ValidRoles.SUPER_ADMIN)) {
      delete findOptions.where;
    }

    if (search) {
      findOptions.where = {
        name: ILike(`%${search}%`),
      };
    }

    if (byUserId) {
      findOptions.where = {
        ...findOptions.where,
        user_id: byUserId,
      };
    }

    const [services, total] =
      await this.serviceRepository.findAndCount(findOptions);

    return { services, total };
  }

  async findOne(user: User, id: string) {
    const service = await this.serviceRepository.findOne({
      where: {
        id,
        enterprise: { id: user?.enterprise?.id },
      },
      withDeleted: true,
    });

    if (!service)
      throw new NotFoundException(`El servicio con id ${id} no se encontro`);

    return service;
  }

  async update(user: User, id: string, updateServiceDto: UpdateServiceDto) {
    try {
      const service = await this.findOne(user, id);
      Object.assign(service, updateServiceDto);

      return await this.serviceRepository.save(service);
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(user: User, id: string) {
    const service = await this.findOne(user, id);
    await this.serviceRepository.softRemove(service);

    return { ok: true, message: 'Servicio eliminado correctamente.' };
  }
}
