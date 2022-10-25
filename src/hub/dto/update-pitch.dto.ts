import { IsEnum, IsOptional } from 'class-validator';
import { Cost } from '../entities/cost.entity';
import { PitchType } from '../types';

export class UpdatePitchDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEnum(PitchType)
  type: PitchType;

  @IsOptional()
  cost: Cost[];
}
