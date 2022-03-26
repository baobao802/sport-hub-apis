import { IsObject, IsString } from 'class-validator';
import { Address } from '../entities';

export class UpdateProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsObject()
  address: Address;
}
