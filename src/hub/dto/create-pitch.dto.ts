import { IsEnum } from 'class-validator';
import { CostType, PitchType } from '../types';

export class CreatePitchDto {
  name: string;

  @IsEnum(PitchType)
  type: PitchType;

  cost: CostType[];
}
