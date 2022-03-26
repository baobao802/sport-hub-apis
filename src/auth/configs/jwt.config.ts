import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  accessTokenExpiration: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION, 10),
  refreshTokenExpiration: parseInt(
    process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    10,
  ),
}));

export const jwtConfigAsync: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<JwtModuleOptions> => ({
    secret: configService.get<string>('jwt.secret'),
  }),
  inject: [ConfigService],
};
