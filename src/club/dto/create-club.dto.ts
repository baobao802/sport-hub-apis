import {
  IsJSON,
  IsNumberString,
  IsObject,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Address } from 'src/place/entities';
import { ClubMember } from '../types';

export class CreateClubDto {
  name: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  @IsJSON()
  members: ClubMember[];

  @MinLength(8, { message: 'Invalid phone number' })
  @MaxLength(13, { message: 'Invalid phone number' })
  @IsNumberString({}, { message: 'Invalid phone number' })
  telephone: string;

  @IsObject()
  address: Address;
}
