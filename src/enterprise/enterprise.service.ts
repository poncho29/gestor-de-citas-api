import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Enterprise } from './entities/enterprise.entity';

import { UsersService } from '../users/users.service';

import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';

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

  findAll() {
    return `This action returns all enterprise`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enterprise`;
  }

  update(id: number, updateEnterpriseDto: UpdateEnterpriseDto) {
    return `This action updates a #${id} enterprise`;
  }

  remove(id: number) {
    return `This action removes a #${id} enterprise`;
  }
}
