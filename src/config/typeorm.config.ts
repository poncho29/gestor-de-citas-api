import { join } from 'path';

import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: +configService.get('DATABASE_PORT'),
  database: configService.get('DB_NAME'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  ssl: configService.get('POSTGRES_SSL') === 'true',
  entities: [join(__dirname + '../../**/*.entity{.js,.ts}')],
  synchronize: configService.get('SYNCHRONIZE') === 'true',
});
