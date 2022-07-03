import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsUrl,
} from 'class-validator';
import { Address } from 'src/place/entities';

export class CreateOfficeDto {
  @IsEmail()
  email: string;

  @IsNumberString()
  phone: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsUrl()
  picture: string;

  @IsObject()
  address: Address;
}
