import { IsOptional } from 'class-validator';

export class FilterParams {
  @IsOptional()
  search?: string;
}
