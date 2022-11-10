import { Matches, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  password: string;

  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  newPassword: string;
}
