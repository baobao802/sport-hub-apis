import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserInfo } from 'src/common/types';
import { LoginDto, RegisterDto } from './dto';
import { KeycloakAuthStrategy } from './strategies';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private authStrategy: KeycloakAuthStrategy,
    private configService: ConfigService,
  ) {}

  async loginGoogle(googleAccessToken: string) {
    return this.authStrategy.login({
      client_id: this.configService.get('kc.clientId'),
      client_secret: this.configService.get('kc.secret'),
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
      subject_token: googleAccessToken,
      subject_issuer: 'google',
    });
  }

  async login(loginDto: LoginDto) {
    return this.authStrategy.login({
      client_id: this.configService.get('kc.clientId'),
      client_secret: this.configService.get('kc.secret'),
      grant_type: 'password',
      scope: 'openid',
      username: loginDto.username,
      password: loginDto.password,
    });
  }

  async register(registerDto: RegisterDto) {
    await this.authStrategy.register(registerDto);
  }

  async authenticate(accessToken: string): Promise<UserInfo> {
    return this.authStrategy.authenticate(accessToken);
  }

  async refreshToken(accessToken: string, refreshToken: string) {
    return this.authStrategy.refreshToken(accessToken, refreshToken);
  }

  async logout(accessToken: string, refreshToken: string) {
    return this.authStrategy.logout(accessToken, refreshToken);
  }
}
