import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Role } from 'src/roles/enum';

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
    const { id, emails } = profile;

    return {
      id,
      email: emails[0].value,
      roles: [Role.USER],
    };
  }

  // async validate(_accessToken, _refreshToken, profile: Profile) {
  //   const { id, name, emails, photos } = profile;

  //   return {
  //     id,
  //     firstName: name.givenName,
  //     lastName: name.familyName,
  //     email: emails[0].value,
  //     avatar: photos[0].value,
  //     roles: [Role.USER],
  //   };
  // }
}
