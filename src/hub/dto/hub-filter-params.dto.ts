import { IsEnum, IsOptional } from 'class-validator';
import { FilterParams } from 'src/common/dto';
import { HubStatus } from '../types';

export class HubFilterParams extends FilterParams {
  @IsOptional()
  @IsEnum(HubStatus)
  status?: HubStatus;

  @IsOptional()
  city?: string;
}
