import { Injectable, InternalServerErrorException } from '@nestjs/common';
import mongoose from 'mongoose';

import { MongoDBConnection } from '../connection';

interface Quote {
  instrumentId: mongoose.Schema.Types.ObjectId;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

interface FilterQuote {
  instrumentId: mongoose.Schema.Types.ObjectId;
  createdAt: {
    $gte: Date;
    $lt: Date;
  };
}

@Injectable()
export class QuoteModelService {
  private quoteModel = MongoDBConnection.getInstance().getSchema('Quote');

  /**
   *
   * @param quote Data recieved from ws
   * @returns Quote object created
   */
  public async create(quote: Quote) {
    try {
      const newQuote = new this.quoteModel(quote);

      return newQuote.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async find(filter: FilterQuote): Promise<
    {
      createdAt: Date;
      instrumentId: mongoose.Schema.Types.ObjectId;
      price: number;
    }[]
  > {
    try {
      return await this.quoteModel.find(filter).lean();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async delete(paymentId: mongoose.Schema.Types.ObjectId) {
    try {
      return await this.quoteModel.deleteOne({ _id: paymentId });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
