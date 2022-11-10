import { Role } from 'src/auth/types';

export enum PostgresErrorCode {
  UniqueViolation = '23505',
}

export type AppUser = {
  sub: string;
  given_name: string;
  family_name: string;
  preferred_username: string;
  email: string;
  attributes?: {
    telephone: string;
  };
  resource_access: {
    [appName: string]: {
      roles: Role[];
    };
  };
  email_verified: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type UserInfo = {
  id: string;
  givenName: string;
  familyName: string;
  username: string;
  email: string;
  telephone: string;
  roles: Role[];
  emailVerified: boolean;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};
