import { IsOptional } from 'class-validator';
import { FilterParams } from 'src/common/dto/filter-params.dto';

export class UserFilterParams extends FilterParams {
  @IsOptional()
  status?: string;
}
