import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Headers,
} from '@nestjs/common';
import { InstrumentService } from 'src/services';

@Controller('candle')
export class CandleController {
  constructor(private readonly instrumentService: InstrumentService) {}

  @Get(':isinId')
  public getOneById(
    @Param('isinId') isinId: string,
    @Query('timestamp') timestamp: string,
  ) {
    return this.instrumentService.getCandle(isinId, timestamp);
  }
}
