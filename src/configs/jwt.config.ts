import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiration: parseInt(process.env.JWT_EXPIRATION, 10),
}));

export const jwtConfigAsync: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<JwtModuleOptions> => ({
    secret: configService.get<string>('jwt.secret'),
    signOptions: {
      expiresIn: configService.get<number>('jwt.expiration'),
    },
  }),
  inject: [ConfigService],
};
