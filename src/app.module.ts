import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { HealthController } from './controllers';
import { validate } from './common/config/environment.validation';
import { ConfigModule as InternalConfigModule } from './common/config/config.module';
import { InstrumentService } from './services';
import { QuoteService } from './services';
import { SocketModule } from './ws/socket.module';
import { CandleController } from './controllers/candle.controller';
import { InstrumentModelService } from './db/models/instrument-model.service';
import { QuoteModelService } from './db/models/quote-model.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate,
    }),
    InternalConfigModule,
    HttpModule,
    SocketModule,
  ],
  controllers: [HealthController, CandleController],
  providers: [
    InstrumentService,
    QuoteService,
    InstrumentModelService,
    QuoteModelService,
  ],
})
export class AppModule {}
