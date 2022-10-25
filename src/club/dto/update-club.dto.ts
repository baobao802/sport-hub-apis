import { IsJSON, IsOptional } from 'class-validator';
import { ClubMember } from '../types';

export class UpdateClubDto {
  name: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  @IsJSON()
  members: ClubMember[];
}
