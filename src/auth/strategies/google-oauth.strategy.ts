import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_SECRET'),
      callbackURL: 'http://localhost:3000/api/v1/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(_accessToken, _refreshToken, profile: Profile) {
    const { id, name, emails, provider, photos } = profile;

    return {
      provider,
      id,
      name: name.givenName,
      username: emails[0].value,
      avatar: photos[0].value,
    };
  }
}
