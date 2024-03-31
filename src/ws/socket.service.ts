/* eslint-disable no-console */
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as WebSocket from 'ws';
import { timer } from 'rxjs';
import { InstrumentService, QuoteService } from 'src/services';
import { InstrumentSocketDto } from 'src/dto/instrument-socket.dto';
import { QuoteSocketDto } from 'src/dto';
import { ConfigService } from 'src/common/config/configService';

@Injectable()
export class SocketService implements OnModuleInit {
  private instrumentWs: WebSocket;
  private quoteWs: WebSocket;
  private isConnect = false;

  constructor(
    private readonly instrumentService: InstrumentService,
    private readonly quoteService: QuoteService,
    private readonly configService: ConfigService,
  ) {}

  public async onModuleInit() {
    await this.connect();
  }

  public async connect() {
    // INSTRUMENT WS
    this.instrumentWs = new WebSocket(
      this.configService.environment.INSTRUMENT_WS_URL,
    );
    this.instrumentWs.on('open', () => {
      console.log('Listening instruments ws...');
      this.isConnect = true;
      this.instrumentWs.send(Math.random());
    });

    this.instrumentWs.on('error', (message) => {
      this.instrumentWs.close();
      this.isConnect = false;
    });

    this.instrumentWs.on('close', (message) => {
      timer(1000).subscribe(() => {
        this.isConnect = false;
        this.connect();
      });
    });

    await this.instrumentWs.on('message', async (message: unknown) => {
      const instrumentData = message.toString();
      const event = JSON.parse(
        instrumentData,
      ) as unknown as InstrumentSocketDto;
      if (event.type === 'ADD') {
        await this.instrumentService.create(event);
      } else if (event.type === 'DELETE') {
        await this.instrumentService.delete(event.data.isin);
      }
    });

    // QUOTE WS
    this.quoteWs = new WebSocket(this.configService.environment.QUOTE_WS_URL);
    this.quoteWs.on('open', () => {
      console.log('Listening quotes ws...');
      this.isConnect = true;
      this.quoteWs.send(Math.random());
    });

    this.quoteWs.on('error', (message) => {
      this.quoteWs.close();
      this.isConnect = false;
    });

    this.quoteWs.on('close', (message) => {
      timer(1000).subscribe(() => {
        this.isConnect = false;
        this.connect();
      });
    });

    await this.quoteWs.on('message', async (message: unknown) => {
      const quoteData = message.toString();
      await this.quoteService.create(
        JSON.parse(quoteData) as unknown as QuoteSocketDto,
      );
    });
  }
}
