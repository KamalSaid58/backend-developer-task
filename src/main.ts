import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register global exception filter for standardized error responses
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
bootstrap();
