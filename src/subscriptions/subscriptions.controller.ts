import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';

import { SubscriptionsService } from './subscriptions.service';

import { Auth } from '../auth/decorators';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
// import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PaginationDto } from '../common/dtos';

import { ValidRoles } from '../auth/interfaces';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Auth(ValidRoles.SUPER_ADMIN)
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @Auth(ValidRoles.SUPER_ADMIN)
  findAll(@Query() pagination: PaginationDto) {
    return this.subscriptionsService.findAll(pagination);
  }

  @Get(':id')
  @Auth(ValidRoles.SUPER_ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionsService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  // ) {
  //   return this.subscriptionsService.update(+id, updateSubscriptionDto);
  // }

  @Delete(':id')
  @Auth(ValidRoles.SUPER_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionsService.remove(id);
  }
}
