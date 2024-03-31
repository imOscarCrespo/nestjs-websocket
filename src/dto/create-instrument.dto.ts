import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInstrumentDto {
  @IsString()
  @IsNotEmpty()
  public isin: string;

  @IsString()
  @IsNotEmpty()
  public description: string;
}
