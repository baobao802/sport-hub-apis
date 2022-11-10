import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Address } from 'src/place/entities';

export class CreateHubDto {
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsOptional()
  address: Address;
}
