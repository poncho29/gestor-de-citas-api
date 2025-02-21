import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { SeedModule } from './seed/seed.module';

import { SeedService } from './seed/seed.service';

async function bootstrap() {
  Logger.log('Starting seed...');
  const app = await NestFactory.create(SeedModule);

  const seeder = app.get(SeedService);

  await seeder.runSeed();

  await app.close();

  Logger.log('Seed complete');
}

bootstrap();
