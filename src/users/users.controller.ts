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

import { UsersService } from './users.service';

import { Auth, GetUser } from '../auth/decorators';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dtos';

import { ValidRoles } from '../auth/interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(ValidRoles.SUPER_ADMIN, ValidRoles.ADMIN)
  create(@GetUser() user: User, @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(user, createUserDto);
  }

  @Get()
  @Auth(ValidRoles.SUPER_ADMIN, ValidRoles.ADMIN)
  findAll(@GetUser() user: User, @Query() pagination: PaginationDto) {
    return this.usersService.findAll(user, pagination);
  }

  @Get(':id')
  @Auth(ValidRoles.SUPER_ADMIN, ValidRoles.ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.SUPER_ADMIN, ValidRoles.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.SUPER_ADMIN, ValidRoles.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
