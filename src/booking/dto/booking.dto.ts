import { IsNumber } from 'class-validator';

export class BookingDto {
  @IsNumber()
  pitchId: number;

  time: string;

  @IsNumber()
  cost: number;

  date: string;
}
