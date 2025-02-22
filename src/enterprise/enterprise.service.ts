import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { DataSource, FindManyOptions, ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Enterprise } from './entities/enterprise.entity';
import { User } from '../users/entities/user.entity';

import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { PaginationDto } from '../common/dtos';

import { handleDBErrors } from '../helpers';

import { ValidRoles } from '../auth/interfaces';

@Injectable()
export class EnterpriseService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,

    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
  ) {}

  async create(createEnterpriseDto: CreateEnterpriseDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { user, ...restData } = createEnterpriseDto;
      const { password, ...restUser } = user;

      const adminUser = queryRunner.manager.create(User, {
        ...restUser,
        password: await bcrypt.hash(password, 10),
        roles: [ValidRoles.ADMIN],
      });

      await queryRunner.manager.save(adminUser);

      const enterprise = queryRunner.manager.create(Enterprise, {
        ...restData,
        users: [adminUser],
      });

      await queryRunner.manager.save(enterprise);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return enterprise;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

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
      withDeleted: true,
    });

    if (!enterprise)
      throw new NotFoundException(`Empresa con ID ${id} no existe.`);

    return enterprise;
  }

  async update(id: string, updateEnterpriseDto: UpdateEnterpriseDto) {
    try {
      delete updateEnterpriseDto.user;

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
