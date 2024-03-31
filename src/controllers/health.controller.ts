import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('health')
export class HealthController {
  @Get()
  public logout(@Req() request: Request, @Res() response: Response) {
    return response.sendStatus(200);
  }
}
