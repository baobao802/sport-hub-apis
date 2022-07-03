import { IsNotEmpty, IsString } from 'class-validator';

export class ImportPlacesDto {
  @IsNotEmpty()
  cities: {
    name: string;
    districts: {
      name: string;
    }[];
  }[];

  @IsString()
  @IsNotEmpty()
  country: string;
}
