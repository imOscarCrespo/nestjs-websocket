import { Global, Module } from '@nestjs/common';

import { ConfigService } from './configService';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
