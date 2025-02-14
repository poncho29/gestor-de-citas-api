import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, ILike, Repository } from 'typeorm';

import { Enterprise } from './entities/enterprise.entity';

import { UsersService } from '../users/users.service';

import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { PaginationDto } from '../common/dtos';

import { handleDBErrors } from '../helpers';

import { ValidRoles } from '../auth/interfaces';

@Injectable()
export class EnterpriseService {
  constructor(
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,

    private readonly userService: UsersService,
  ) {}

  async create(createEnterpriseDto: CreateEnterpriseDto) {
    try {
      const { user, ...restData } = createEnterpriseDto;

      const adminUser = await this.userService.create({
        ...user,
        roles: [ValidRoles.ADMIN],
      });

      const enterprise = this.enterpriseRepository.create({
        ...restData,
        users: [adminUser],
      });

      await this.enterpriseRepository.save(enterprise);

      return enterprise;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0, search = '' } = pagination;

    const findOptions: FindManyOptions<Enterprise> = {
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
    };

    if (search) {
      findOptions.where = {
        name: ILike(`%${search}%`),
      };
    }

    const [enterprises, total] =
      await this.enterpriseRepository.findAndCount(findOptions);

    return { enterprises, total };
  }

  async findOne(id: string) {
    const enterprise = await this.enterpriseRepository.findOne({
      where: { id },
      relations: ['users', 'customers', 'services', 'appointments'],
      withDeleted: true,
    });

    if (!enterprise) throw new Error(`Empresa con ID ${id} no existe.`);

    return enterprise;
  }

  async update(id: string, updateEnterpriseDto: UpdateEnterpriseDto) {
    try {
      delete updateEnterpriseDto.user;

      console.log(updateEnterpriseDto);

      const enterprise = await this.findOne(id);
      Object.assign(enterprise, updateEnterpriseDto);

      return await this.enterpriseRepository.save(enterprise);
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.enterpriseRepository.softRemove(user);

    return { ok: true, message: 'Empresa eliminada correctamente.' };
  }
}
