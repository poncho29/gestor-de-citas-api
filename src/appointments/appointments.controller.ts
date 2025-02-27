import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { Auth, GetUser } from '../auth/decorators';

import { User } from '../users/entities/user.entity';

import { AppointmentsService } from './appointments.service';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationDto } from '../common/dtos';

import { ValidRoles } from '../auth/interfaces';

const ADMIN_ROLES = [
  ValidRoles.SUPER_ADMIN,
  ValidRoles.ADMIN,
  ValidRoles.SUB_ADMIN,
];

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Auth(...ADMIN_ROLES)
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser() user: User,
  ) {
    return this.appointmentsService.create(createAppointmentDto, user);
  }

  @Get()
  @Auth(...ADMIN_ROLES)
  findAll(@GetUser() user: User, @Query() pagination: PaginationDto) {
    return this.appointmentsService.findAll(user, pagination);
  }

  @Get(':id')
  @Auth(...ADMIN_ROLES)
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Patch(':id')
  @Auth(...ADMIN_ROLES)
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  @Auth(...ADMIN_ROLES)
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
