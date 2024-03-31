import { Module } from '@nestjs/common';

import { InstrumentService } from '../services/instrument.service';
import { QuoteService } from '../services/quote.service';
import { InstrumentModelService } from '../db/models/instrument-model.service';
import { QuoteModelService } from '../db/models/quote-model.service';

import { SocketService } from './socket.service';

@Module({
  providers: [
    SocketService,
    InstrumentService,
    QuoteService,
    InstrumentModelService,
    QuoteModelService,
  ],
})
export class SocketModule {}
