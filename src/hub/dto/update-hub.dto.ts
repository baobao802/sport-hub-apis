import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Address } from 'src/place/entities';
import { Pitch } from '../entities';

export class UpdateHubDto {
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsOptional()
  picture: string;

  @IsObject()
  @IsOptional()
  address: Address;

  @IsObject()
  @IsOptional()
  pitches: Pitch[];
}
