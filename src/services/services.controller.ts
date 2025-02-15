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

@Controller('services')
@Auth(ValidRoles.SUPER_ADMIN, ValidRoles.ADMIN)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@GetUser() user: User, @Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(user, createServiceDto);
  }

  @Get()
  findAll(@GetUser() user: User, @Query() pagination: PaginationDto) {
    return this.servicesService.findAll(user, pagination);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(user, id, updateServiceDto);
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(user, id);
  }
}
