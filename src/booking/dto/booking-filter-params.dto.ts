import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { FilterParams } from 'src/common/dto';
import { BookingStatus } from '../types';

export class BookingFilterParams extends FilterParams {
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsOptional()
  date?: string;

  @IsOptional()
  cityId?: number;

  @IsOptional()
  pitchId?: number;
}
