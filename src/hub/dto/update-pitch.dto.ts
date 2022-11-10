import { IsEnum, IsOptional } from 'class-validator';
import { CostType, PitchType } from '../types';

export class UpdatePitchDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEnum(PitchType)
  type: PitchType;

  @IsOptional()
  cost: CostType[];
}
