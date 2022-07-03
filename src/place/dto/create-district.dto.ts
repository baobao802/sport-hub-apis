import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateDistrictDto {
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  cityId: number;
}
