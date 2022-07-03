import { IsEnum, IsOptional } from 'class-validator';
import { FilterParams } from 'src/common/dto';
import { OfficeStatus } from '../enum';

export class OfficeFilterParams extends FilterParams {
  @IsOptional()
  @IsEnum(OfficeStatus)
  status?: OfficeStatus;
}
