import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { MongoDBConnection } from '../connection';

import { QuoteModelService } from './quote-model.service';

interface Instrument {
  isin: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class InstrumentModelService {
  private instrumentModel =
    MongoDBConnection.getInstance().getSchema('Instrument');

  constructor(private readonly quoteModelService: QuoteModelService) {}

  public async create(instrument: Instrument) {
    try {
      const newInstrument = new this.instrumentModel(instrument);

      return await newInstrument.save();
    } catch (error) {
      if (error.message.includes('duplicate key error')) {
        return;
      }
      throw new InternalServerErrorException(error && error.message);
    }
  }

  public async findOne(isin: string) {
    try {
      return await this.instrumentModel.findOne({ isin }).lean();
    } catch (error) {
      throw new InternalServerErrorException(error && error.message);
    }
  }

  public async delete(isin: string) {
    try {
      const instrument = await this.findOne(isin);
      if (!instrument) {
        return;
      }
      Promise.all([
        await this.instrumentModel.deleteOne({ isin }),
        await this.quoteModelService.delete(instrument._id),
      ]);

      return;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
