import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, ILike, Repository } from 'typeorm';

import { Plan } from './entities/plan.entity';

import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PaginationDto } from '../common/dtos';

import { handleDBErrors } from '../helpers';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly plansRepository: Repository<Plan>,
  ) {}

  async create(createPlanDto: CreatePlanDto) {
    await this.checkActivePlanByName(createPlanDto.name);

    this.plansRepository.create(createPlanDto);

    return await this.plansRepository.save(createPlanDto);
  }

  async findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0, search = '' } = pagination;

    const findOptions: FindManyOptions<Plan> = {
      take: limit,
      skip: offset,
      order: { updated_at: 'ASC' },
    };

    if (search) {
      findOptions.where = {
        name: ILike(`%${search}%`),
      };
    }

    const [plans, total] = await this.plansRepository.findAndCount(findOptions);

    return { plans, total };
  }

  async findOne(id: string) {
    const plan = await this.plansRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!plan) throw new NotFoundException(`Plan con ID ${id} no existe.`);

    return plan;
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    try {
      if (updatePlanDto?.name) {
        await this.checkActivePlanByName(updatePlanDto.name);
      }

      const plan = await this.findOne(id);
      Object.assign(plan, updatePlanDto);

      return await this.plansRepository.save(plan);
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const plan = await this.findOne(id);
    await this.plansRepository.softRemove(plan);

    return { ok: true, message: 'Plan eliminado correctamente.' };
  }

  async checkActivePlanByName(name: string) {
    const plan = await this.plansRepository.findOne({
      where: { name, deleted_at: null },
    });

    if (plan)
      throw new ConflictException('Ya existe un plan activo con ese nombre.');
  }
}
