import { IsEnum, IsOptional } from 'class-validator';
import { FilterParams } from 'src/common/dto';
import { PitchType } from '../types';

export class PitchFilterParams extends FilterParams {
  @IsOptional()
  @IsEnum(PitchType)
  type?: PitchType;

  @IsOptional()
  time?: string;

  @IsOptional()
  date?: string;

  @IsOptional()
  cityId?: number;
}
