import { IsNotEmpty, IsObject, IsString } from 'class-validator';

interface InstrumentSocketData {
  description: string;
  isin: string;
}

enum InstrumentSocketType {
  ADD = 'ADD',
  DELETE = 'DELETE',
}

export class InstrumentSocketDto {
  @IsObject()
  @IsNotEmpty()
  public data: InstrumentSocketData;

  @IsString()
  @IsNotEmpty()
  public type: InstrumentSocketType;
}
