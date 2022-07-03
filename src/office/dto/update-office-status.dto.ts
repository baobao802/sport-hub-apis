import { IsEnum } from 'class-validator';

import { OfficeStatus } from '../enum';

export class UpdateOfficeStatusDto {
  @IsEnum(OfficeStatus)
  status: OfficeStatus;
}
