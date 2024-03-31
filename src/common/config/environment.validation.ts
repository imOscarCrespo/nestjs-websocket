import { IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

class EnvironmentVariables {
  @IsString({ message: 'Invalid DATABASE_URL' })
  public DATABASE_URL: string;

  @IsString({ message: 'Invalid DATABASE_PARAMS' })
  public DATABASE_PARAMS: string;

  @IsString({ message: 'Invalid INSTRUMENT_WS_URL' })
  public INSTRUMENT_WS_URL: string;

  @IsString({ message: 'Invalid QUOTE_WS_URL' })
  public QUOTE_WS_URL: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};
