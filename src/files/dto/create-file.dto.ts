import { IsMimeType, IsString, IsUrl } from 'class-validator';

export class CreateFileDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsMimeType()
  mimetype: string;
}
