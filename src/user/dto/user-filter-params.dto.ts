import { IsEnum, IsOptional } from 'class-validator';
import { FilterParams } from 'src/common/dto/filter-params.dto';
import { Role } from 'src/permission/enum';

export class UserFilterParams extends FilterParams {
  @IsOptional()
  status?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
