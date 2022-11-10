import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../types';

export class RegisterDto {
  @IsOptional()
  givenName?: string;

  @IsOptional()
  familyName?: string;

  @MinLength(8, { message: 'Invalid telephone' })
  @MaxLength(15, { message: 'Invalid telephone' })
  @IsNumberString({}, { message: 'Invalid telephone' })
  telephone: string;

  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  @IsString()
  password: string;

  @IsOptional()
  roles: {
    id: string;
    name: Role;
  }[];
}
