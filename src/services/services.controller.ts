import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';

import { ServicesService } from './services.service';

import { Auth, GetUser } from '../auth/decorators';

import { User } from '../users/entities/user.entity';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationDto } from '../common/dtos';

import { ValidRoles } from '../auth/interfaces';

const ADMIN_ROLES = [ValidRoles.SUPER_ADMIN, ValidRoles.ADMIN];

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Auth(...ADMIN_ROLES)
  create(@GetUser() user: User, @Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(user, createServiceDto);
  }

  @Get()
  @Auth(...ADMIN_ROLES, ValidRoles.SUB_ADMIN)
  findAll(@GetUser() user: User, @Query() pagination: PaginationDto) {
    return this.servicesService.findAll(user, pagination);
  }

  @Get(':id')
  @Auth(...ADMIN_ROLES, ValidRoles.SUB_ADMIN)
  findOne(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(user, id);
  }

  @Patch(':id')
  @Auth(...ADMIN_ROLES)
  update(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(user, id, updateServiceDto);
  }

  @Delete(':id')
  @Auth(...ADMIN_ROLES)
  remove(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(user, id);
  }
}
