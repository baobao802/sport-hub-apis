import {
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Hub } from 'src/hub/entities';
import { Role } from 'src/permission/enum';
import { Address } from 'src/place/entities';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsOptional()
  @MinLength(8, { message: 'Invalid phone number' })
  @MaxLength(13, { message: 'Invalid phone number' })
  @IsNumberString({}, { message: 'Invalid phone number' })
  telephone?: string;

  @MinLength(4)
  @MaxLength(25)
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role, { each: true })
  roles?: Role[];

  @IsOptional()
  address?: Address;

  @IsOptional()
  hub?: Hub;
}
