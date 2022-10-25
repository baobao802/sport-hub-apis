import { IsNotEmpty } from 'class-validator';

export class ImportPlacesDto {
  @IsNotEmpty()
  cities: {
    name: string;
    districts: {
      name: string;
    }[];
  }[];
}
