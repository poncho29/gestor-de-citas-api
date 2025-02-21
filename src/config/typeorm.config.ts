import { join } from 'path';

import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  // console.log({
  //   type: 'postgres',
  //   host: configService.get('DB_HOST'),
  //   port: +configService.get('DB_PORT'),
  //   database: configService.get('DB_NAME'),
  //   username: configService.get('DB_USERNAME'),
  //   password: configService.get('DB_PASSWORD'),
  //   ssl: configService.get('POSTGRES_SSL') === 'true',
  //   entities: [join(__dirname + '../../**/*.entity{.js,.ts}')],
  //   synchronize: configService.get('SYNCHRONIZE') === 'true',
  // });

  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    ssl: configService.get('POSTGRES_SSL') === 'true',
    entities: [join(__dirname + '../../**/*.entity{.js,.ts}')],
    synchronize: configService.get('SYNCHRONIZE') === 'true',
  };
};
