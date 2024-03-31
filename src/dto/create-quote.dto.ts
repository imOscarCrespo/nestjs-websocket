import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  @IsNotEmpty()
  public isin: string;

  @IsString()
  @IsNotEmpty()
  public description: string;
}
