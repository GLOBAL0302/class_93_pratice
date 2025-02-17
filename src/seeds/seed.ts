import { NestExpressApplication } from '@nestjs/platform-express';
import { SeederModule } from './seed.module';
import { SeederService } from './seeder.service';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(SeederModule);
  const seederService = app.get(SeederService);
  await seederService.seed();
  await app.close();
}

bootstrap();