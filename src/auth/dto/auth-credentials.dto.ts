import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../enum';

export class AuthCredentialsDto {
  @MinLength(4)
  @MaxLength(20)
  @IsString()
  username: string;

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
}
