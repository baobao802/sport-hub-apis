export interface KeycloakUserInfoResponse {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export interface AuthenticationStrategy {
  authenticate(accessToken: string): Promise<KeycloakUserInfoResponse>;
}

export type LoginParams = {
  client_id: string;
  client_secret: string;
  grant_type: string;
  subject_token_type?: string;
  subject_token?: string;
  subject_issuer?: string;
  scope?: string;
  username?: string;
  password?: string;
};

export enum Role {
  APP_USER = 'app_user',
  APP_ADMIN = 'app_admin',
}

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

export type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  session_state: string;
  scope: string;
};
