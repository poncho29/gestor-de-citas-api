import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

import { CustomersService } from './customers.service';

import { Auth, GetUser } from '../auth/decorators';

import { User } from '../users/entities/user.entity';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto } from '../common/dtos';

import { ValidRoles } from '../auth/interfaces';

const ADMIN_ROLES = [ValidRoles.SUPER_ADMIN, ValidRoles.ADMIN];

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Auth(...ADMIN_ROLES, ValidRoles.SUB_ADMIN)
  create(@GetUser() user: User, @Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(user, createCustomerDto);
  }

  @Get()
  @Auth(...ADMIN_ROLES, ValidRoles.SUB_ADMIN)
  findAll(@Query() pagination: PaginationDto) {
    return this.customersService.findAll(pagination);
  }

  @Get(':id')
  @Auth(...ADMIN_ROLES, ValidRoles.SUB_ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @Auth(...ADMIN_ROLES, ValidRoles.SUB_ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Auth(...ADMIN_ROLES)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove(id);
  }
}
