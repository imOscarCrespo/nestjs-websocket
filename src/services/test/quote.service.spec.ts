import { Test, TestingModule } from '@nestjs/testing';
import { QuoteSocketDto } from 'src/dto';
import mongoose from 'mongoose';

import { QuoteModelService } from '../../db/models/quote-model.service';
import { InstrumentModelService } from '../../db/models/instrument-model.service';
import { InstrumentService } from '../instrument.service';
import { QuoteService } from '../quote.service';

describe('QuoteService', () => {
  let quoteService: QuoteService;

  let mockInstrumentModel = {
    collection: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    find: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  let mockQuoteModel = {
    collection: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    find: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // we do the following to not show the logs when running the tests
    process.env = {
      ...process.env,
      DEBUG: '',
    };

    mockInstrumentModel = {
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn(),
      find: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    };

    mockQuoteModel = {
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn(),
      find: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstrumentService,
        QuoteService,
        {
          provide: QuoteModelService,
          useValue: mockQuoteModel,
        },
        {
          provide: InstrumentModelService,
          useValue: mockInstrumentModel,
        },
      ],
    }).compile();

    quoteService = module.get<QuoteService>(QuoteService);
  });

  it('should be defined', () => {
    expect(quoteService).toBeDefined();
  });

  describe('create', () => {
    it('should create a quote', async () => {
      mockQuoteModel.create.mockResolvedValue({ insertedId: '123' });
      mockInstrumentModel.findOne.mockResolvedValue({ _id: '123' });

      const quote = {
        data: { isin: '123', price: 10 },
      };

      const result = await quoteService.create(quote as QuoteSocketDto);

      expect(result).toEqual({ insertedId: '123' });
    });

    it('should not create a quote if missing data', async () => {
      const quote = {
        data: { isin: '123', price: 10 },
      };

      await quoteService.create(quote as QuoteSocketDto);

      expect(mockInstrumentModel.create).not.toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('should find one quote', async () => {
      mockQuoteModel.find.mockResolvedValue({
        _id: '123',
        isin: '123',
        description: 'description',
      });

      const result = await quoteService.find(
        new mongoose.Schema.ObjectId('123'),
        '2021-01-01',
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe('delete', () => {
    it('should delete a quote', async () => {
      mockQuoteModel.delete.mockResolvedValue({ deletedCount: 1 });

      await quoteService.delete(new mongoose.Schema.ObjectId('123'));

      expect(mockQuoteModel.delete).toHaveBeenCalledTimes(1);
    });
  });
});
