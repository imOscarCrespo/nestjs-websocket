import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from './common/config/configService';
import { MongoDBConnection } from './db/connection';
import { InstrumentSchema, QuoteSchema } from './db/schemas';

async function bootstrap() {
  const instance = MongoDBConnection.getInstance();
  instance.connect();
  instance.createSchema('Instrument', InstrumentSchema);
  instance.createSchema('Quote', QuoteSchema);

  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  const { environment } = configService;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { groups: ['transform'] },
    }),
  );

  await app.listen(environment.PORT);

  // eslint-disable-next-line no-console
  console.info(
    `🚀 service is running on: http://localhost:${environment.PORT}`,
  );
}
bootstrap();
