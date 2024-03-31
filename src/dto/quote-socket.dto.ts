import { IsNotEmpty, IsObject, IsString } from 'class-validator';

interface QuoteSocketData {
  price: number;
  isin: string;
}

enum QuoteSocketType {
  QUOTE = 'quote',
}

export class QuoteSocketDto {
  @IsObject()
  @IsNotEmpty()
  public data: QuoteSocketData;

  @IsString()
  @IsNotEmpty()
  public type: QuoteSocketType;
}
