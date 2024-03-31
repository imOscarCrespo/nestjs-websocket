import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pjson = require('../../../package.json');

@Injectable()
export class ConfigService {
  public get environment() {
    const env = process.env;

    return {
      serviceName: pjson.name,
      serviceVersion: pjson.version,
      PORT: env.PORT ? Number(env.PORT) : 3889,
      DATABASE_URL: env.DATABASE_READER_URL,
      DATABASE_PARAMS: env.DATABASE_READER_PARAMS,
      INSTRUMENT_WS_URL: env.INSTRUMENT_WS_URL,
      QUOTE_WS_URL: env.QUOTE_WS_URL,
    };
  }
}
