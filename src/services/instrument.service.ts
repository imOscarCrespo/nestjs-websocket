import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

import { InstrumentModelService } from '../db/models/instrument-model.service';
import { InstrumentSocketDto, Quote } from '../dto';

import { QuoteService } from './quote.service';
dayjs.extend(utc);
dayjs.extend(timezone);

export interface AutomaticAccess {
  credentialId: string;
  placeId: string;
  organizationId: string;
  channelId: string;
}

@Injectable()
export class InstrumentService {
  constructor(
    private readonly instrumentModel: InstrumentModelService,
    private readonly quoteService: QuoteService,
  ) {}

  /**
   *
   * @param instrument Data recieved from ws
   * @returns Instrument object created
   */
  public async create(instrument: InstrumentSocketDto) {
    // Check if the data is valid
    if (!instrument || !instrument.data || !instrument.data.isin) {
      return;
    }
    const doc = {
      isin: instrument.data.isin,
      description: instrument.data?.description || '',
      createdAt: dayjs().utc().toDate(),
      updatedAt: dayjs().utc().toDate(),
    };

    return this.instrumentModel.create(doc);
  }

  /**
   *
   * @param isin Isin of the instrument
   * @returns Instrument
   */
  public async find(isin: string) {
    return this.instrumentModel.findOne(isin);
  }

  /**
   *
   * @param isin Isin of the instrument
   * @returns void
   */
  public async delete(isin: string) {
    try {
      const instrument = await this.find(isin);
      if (!instrument) {
        return;
      }
      Promise.all([
        await this.instrumentModel.delete(isin),
        await this.quoteService.delete(instrument._id),
      ]);

      return;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   *
   * @param isin Isin of the instrument
   * @param date Date of the candle
   * @returns Candle
   */
  public async getCandle(isin: string, date: string) {
    if (this.isValidDate(date) === false) {
      throw new BadRequestException(
        'Invalid date format, format should be YYYY-MM-DDTHH:mm:ss.SSSZ',
      );
    }
    try {
      const instrument = await this.find(isin);

      if (!instrument) {
        return {};
      }

      const quotes: Quote[] = await this.quoteService.find(
        instrument._id,
        date,
      );

      if (quotes && quotes.length === 0) {
        return {};
      }

      const recentQuote = quotes.reduce((prev, current) =>
        prev.createdAt < current.createdAt ? prev : current,
      );

      const highQuote = quotes.reduce((prev, current) => {
        if (prev.price > current.price) {
          return prev;
        }

        return current;
      });

      const lowQuote = quotes.reduce((prev, current) => {
        if (prev.price < current.price) {
          return prev;
        }

        return current;
      });

      const closeQuote = quotes.reduce((prev, current) =>
        prev.createdAt > current.createdAt ? prev : current,
      );

      return {
        openTimestamp: recentQuote.createdAt,
        openPrice: recentQuote.price,
        highPrice: highQuote.price,
        lowPrice: lowQuote.price,
        closePrice: closeQuote.price,
        closeTimestamp: closeQuote.createdAt,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private isValidDate(date: string) {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

    return regex.test(date);
  }
}
