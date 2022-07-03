import { Role } from 'src/permission/enum';

export interface JwtPayload {
  email: string;
  sub: string;
  roles: Role[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}
