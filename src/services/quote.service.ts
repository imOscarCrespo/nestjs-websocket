import {
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import mongoose from 'mongoose';

import { QuoteSocketDto, Quote } from '../dto';
import { QuoteModelService } from '../db/models/quote-model.service';

import { InstrumentService } from './instrument.service';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class QuoteService {
  constructor(
    @Inject(forwardRef(() => InstrumentService))
    private readonly instrumentService: InstrumentService,
    private readonly quoteModelService: QuoteModelService,
  ) {}

  /**
   *
   * @param quote Data recieved from ws
   * @returns Quote object created
   */
  public async create(quote: QuoteSocketDto) {
    let doc: {
      instrumentId: mongoose.Schema.Types.ObjectId;
      price: number;
      createdAt: Date;
      updatedAt: Date;
    };
    try {
      const instrument = await this.instrumentService.find(quote.data.isin);
      if (!instrument) {
        return;
      }
      doc = {
        instrumentId: instrument._id,
        price: quote.data.price,
        createdAt: dayjs().utc().toDate(),
        updatedAt: dayjs().utc().toDate(),
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return this.quoteModelService.create(doc);
  }

  /**
   *
   * @param instrumentId InstrumentId
   * @param date Date of the quote
   * @returns Quote list
   */
  public async find(
    instrumentId: mongoose.Schema.Types.ObjectId,
    date: string,
  ): Promise<Quote[]> {
    const startDate = dayjs(date)
      .startOf('minute')
      .set('second', 0)
      .utc()
      .toDate();
    const endDate = dayjs(date)
      .startOf('minute')
      .set('second', 59)
      .utc()
      .toDate();

    const filter = {
      instrumentId,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    return this.quoteModelService.find(filter);
  }

  /**
   *
   * @param paymentId ObjectId
   * @returns Delete result
   */
  public async delete(paymentId: mongoose.Schema.Types.ObjectId) {
    return this.quoteModelService.delete(paymentId);
  }
}
