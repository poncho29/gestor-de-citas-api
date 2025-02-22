import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, ILike, Repository } from 'typeorm';
import { addMonths } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { Subscription } from './entities/subscription.entity';

import { EnterpriseService } from '../enterprise/enterprise.service';
import { PlansService } from '../plans/plans.service';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
// import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PaginationDto } from '../common/dtos';

import { handleDBErrors } from '../helpers';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,

    private readonly enterpriseService: EnterpriseService,
    private readonly plansService: PlansService,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const { enterprise_id, plan_id } = createSubscriptionDto;

    const enterprise = await this.enterpriseService.findOne(enterprise_id);

    const activeSubscription = await this.subscriptionsRepository.findOne({
      where: { enterprise: { id: enterprise.id }, deleted_at: null },
    });

    if (activeSubscription)
      throw new ConflictException(
        'La empresa ya cuenta con una suscripcion activa.',
      );

    const plan = await this.plansService.findOne(plan_id);

    if (plan.deleted_at) throw new ConflictException('Plan no inactivo.');

    const { startDate, endDate } = this.getSubscriptionDuration(plan.duration);

    try {
      const newSubscription = this.subscriptionsRepository.create({
        start_date: startDate,
        end_date: endDate,
        enterprise,
        plan,
      });

      await this.subscriptionsRepository.save(newSubscription);

      return newSubscription;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0, search = '' } = pagination;

    const findOptions: FindManyOptions<Subscription> = {
      take: limit,
      skip: offset,
      order: { updated_at: 'ASC' },
      relations: ['enterprise', 'plan'],
    };

    if (search) {
      findOptions.where = {
        enterprise: { name: ILike(`%${search}%`) },
      };
    }

    const [subscriptions, total] =
      await this.subscriptionsRepository.findAndCount(findOptions);

    return { subscriptions, total };
  }

  async findOne(id: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: ['enterprise', 'plan'],
    });

    if (!subscription)
      throw new NotFoundException('Suscripcion no encontrada.');

    return subscription;
  }

  // update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
  //   return `This action updates a #${id} subscription`;
  // }

  async remove(id: string) {
    const subscription = await this.findOne(id);

    await this.subscriptionsRepository.softRemove(subscription);

    return { ok: true, message: 'Suscripcion inhabilitada correctamente.' };
  }

  private getSubscriptionDuration(planDuration: number) {
    const colombiaTimeZone = 'America/Bogota';

    // Fecha actual en UTC
    const startDate = new Date();

    // Agregar meses usando date-fns
    const endDate = addMonths(startDate, planDuration / 30);

    // Convertir las fechas a la zona horaria de Colombia
    const startDateInColombia = toZonedTime(startDate, colombiaTimeZone);
    const endDateInColombia = toZonedTime(endDate, colombiaTimeZone);

    return {
      startDate: startDateInColombia,
      endDate: endDateInColombia,
    };
  }
}
