import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentSocketDto } from 'src/dto';

import { QuoteModelService } from '../../db/models/quote-model.service';
import { InstrumentModelService } from '../../db/models/instrument-model.service';
import { InstrumentService } from '../instrument.service';
import { QuoteService } from '../quote.service';

describe('InstrumentService', () => {
  let instrumentService: InstrumentService;

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

    instrumentService = module.get<InstrumentService>(InstrumentService);
  });

  it('should be defined', () => {
    expect(instrumentService).toBeDefined();
  });

  describe('create', () => {
    it('should create a instrument', async () => {
      mockInstrumentModel.create.mockResolvedValue({ insertedId: '123' });

      const instrument = {
        data: {
          isin: '123',
          description: 'description',
        },
      };

      const result = await instrumentService.create(
        instrument as InstrumentSocketDto,
      );

      expect(result).toEqual({ insertedId: '123' });
    });

    it('should not create an instrument if missing data', async () => {
      const instrument = {
        data: { description: 'Some description' },
      };

      await instrumentService.create(
        instrument as unknown as InstrumentSocketDto,
      );

      expect(mockInstrumentModel.create).not.toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('should find one instrument', async () => {
      mockInstrumentModel.findOne.mockResolvedValue({
        _id: '123',
        isin: '123',
        description: 'description',
      });

      const result = await instrumentService.find('123');

      expect(result).toMatchSnapshot();
    });
  });

  describe('getCandle', () => {
    it('should get candle', async () => {
      mockInstrumentModel.findOne.mockResolvedValue({ _id: '123' });
      mockQuoteModel.find.mockResolvedValue([
        {
          instrumentId: '123',
          price: 10,
          createdAt: '2024-03-30T13:00:05.005Z',
        },
        {
          instrumentId: '123',
          price: 11,
          createdAt: '2024-03-30T13:00:06.005Z',
        },
        {
          instrumentId: '123',
          price: 15,
          createdAt: '2024-03-30T13:00:13.005Z',
        },
        {
          instrumentId: '123',
          price: 11,
          createdAt: '2024-03-30T13:00:19.005Z',
        },
        {
          instrumentId: '123',
          price: 13,
          createdAt: '2024-03-30T13:00:32.005Z',
        },
        {
          instrumentId: '123',
          price: 12,
          createdAt: '2024-03-30T13:00:49.005Z',
        },
        {
          instrumentId: '123',
          price: 12,
          createdAt: '2024-03-30T13:00:52.005Z',
        },
      ]);

      const result = await instrumentService.getCandle(
        '123',
        '2024-03-30T13:00:48.005Z',
      );

      expect(result).toEqual({
        closePrice: 12,
        closeTimestamp: '2024-03-30T13:00:52.005Z',
        highPrice: 15,
        lowPrice: 10,
        openPrice: 10,
        openTimestamp: '2024-03-30T13:00:05.005Z',
      });
    });

    it('should return empty object if instrument not found', async () => {
      mockInstrumentModel.findOne.mockResolvedValue(null);

      const result = await instrumentService.getCandle(
        '123',
        '2024-03-30T09:12:30.871Z',
      );

      expect(result).toEqual({});
    });

    it('should return empty object if no quotes found', async () => {
      mockInstrumentModel.findOne.mockResolvedValue({ _id: '123' });
      mockQuoteModel.find.mockResolvedValue([]);

      const result = await instrumentService.getCandle(
        '123',
        '2024-03-30T09:12:30.871Z',
      );

      expect(result).toEqual({});
    });
  });

  describe('delete', () => {
    it('should delete an instrument', async () => {
      mockInstrumentModel.findOne.mockResolvedValue({ _id: '123' });
      mockInstrumentModel.delete.mockResolvedValue({ deletedCount: 1 });
      mockQuoteModel.delete.mockResolvedValue({ deletedCount: 1 });

      await instrumentService.delete('123');

      expect(mockInstrumentModel.delete).toHaveBeenCalledTimes(1);
    });

    it('should not call delete if instrument not found', async () => {
      mockInstrumentModel.delete.mockResolvedValue({ deletedCount: 0 });

      await instrumentService.delete('123');

      expect(mockInstrumentModel.delete).not.toHaveBeenCalled();
    });
  });
});
