import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class GetUsersFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  size?: number;
}
