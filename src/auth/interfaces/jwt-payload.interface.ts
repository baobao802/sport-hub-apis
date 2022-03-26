import { Role } from 'src/roles/enum';

export interface JwtPayload {
  email: string;
  sub: string;
  roles: Role[];
}
