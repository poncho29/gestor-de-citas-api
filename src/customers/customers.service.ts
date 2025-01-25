import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, ILike, Repository } from 'typeorm';

import { Customer } from './entities/customer.entity';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto } from '../common/dtos';

import { handleDBErrors } from '../helpers';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const existingCustomer = await this.customerRepository.findOne({
        where: {
          phone: createCustomerDto.phone,
          user_id: createCustomerDto.user_id,
        },
      });

      if (existingCustomer)
        throw new ConflictException(
          'Ya existe un cliente con este número de teléfono para el usuario actual.',
        );

      const customer = this.customerRepository.create(createCustomerDto);
      return await this.customerRepository.save(customer);
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0, search = '' } = pagination;

    const findOptions: FindManyOptions<Customer> = {
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
    };

    if (search) {
      findOptions.where = {
        name: ILike(`%${search}%`),
      };
    }

    const [customers, total] =
      await this.customerRepository.findAndCount(findOptions);

    return { customers, total };
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOneBy({ id });

    if (!customer)
      throw new NotFoundException(`El cliente con id ${id} no se encontro`);

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      const customer = await this.findOne(id);
      Object.assign(customer, updateCustomerDto);

      return await this.customerRepository.save(customer);
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    return await this.customerRepository.softRemove(customer);
  }
}
