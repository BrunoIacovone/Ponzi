import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FirebaseExceptionFilter } from './filters/firebase-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new FirebaseExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
