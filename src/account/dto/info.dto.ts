import { IsEmail, IsOptional } from 'class-validator';

export class InfoDto {
  @IsOptional()
  givenName: string;

  @IsOptional()
  familyName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  telephone: string;
}
