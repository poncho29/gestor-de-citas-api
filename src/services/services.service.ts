import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, ILike, Repository } from 'typeorm';

import { Service } from './entities/service.entity';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationDto } from '../common/dtos';

import { handleDBErrors } from '../helpers';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    try {
      const service = this.serviceRepository.create(createServiceDto);
      return await this.serviceRepository.save(service);
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0, search = '' } = pagination;

    const findOptions: FindManyOptions<Service> = {
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
    };

    if (search) {
      findOptions.where = {
        name: ILike(`%${search}%`),
      };
    }

    const [services, total] =
      await this.serviceRepository.findAndCount(findOptions);

    return { services, total };
  }

  async findOne(id: string) {
    const service = await this.serviceRepository.findOneBy({ id });

    if (!service)
      throw new NotFoundException(`El servicio con id ${id} no se encontro`);

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    try {
      const service = await this.findOne(id);
      Object.assign(service, updateServiceDto);

      return await this.serviceRepository.save(service);
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    return await this.serviceRepository.softRemove(service);
  }
}
