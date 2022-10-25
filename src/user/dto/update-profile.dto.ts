import {
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Address } from 'src/place/entities';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @MinLength(8, { message: 'Invalid phone number' })
  @MaxLength(13, { message: 'Invalid phone number' })
  @IsNumberString({}, { message: 'Invalid phone number' })
  telephone?: string;

  @IsOptional()
  @IsObject()
  address?: Address;
}
