import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import {
  KeycloakConnectModuleAsyncOptions,
  KeycloakConnectOptions,
} from 'nest-keycloak-connect';

export default registerAs('kc', () => ({
  authServerUrl: process.env.KC_AUTH_SERVER_URL,
  realm: process.env.KC_REALM,
  clientId: process.env.KC_CLIENT_ID,
  secret: process.env.KC_SECRET,
}));

export const keycloakConfigAsync: KeycloakConnectModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<KeycloakConnectOptions> => ({
    authServerUrl: configService.get<string>('kc.authServerUrl'),
    realm: configService.get<string>('kc.realm'),
    clientId: configService.get<string>('kc.clientId'),
    secret: configService.get<string>('kc.secret'),
    cookieKey: 'access_token',
  }),
  inject: [ConfigService],
};
