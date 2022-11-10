// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { Profile, Strategy } from 'passport-google-oauth20';
// import { UsersService } from 'src/user/users.service';

// @Injectable()
// export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
// constructor(
//   private usersService: UsersService,
//   private configService: ConfigService,
// ) {
//   super({
//     clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
//     clientSecret: configService.get<string>('GOOGLE_SECRET'),
//     callbackURL: 'http://localhost:8080/api/v1/auth/google/redirect',
//     scope: ['email', 'profile'],
//   });
// }
// async validate(_accessToken, _refreshToken, profile: Profile) {
//   const { emails, name } = profile;
//   const email = emails[0].value;
//   const found = await this.usersService.findByEmail(email);
//   if (!found) {
//     const user = await this.usersService.createOne({
//       email,
//       password: '123qweASD!@#',
//       firstName: name.givenName,
//       lastName: name.familyName,
//     });
//     return {
//       id: user.id,
//       email: user.email,
//       roles: user.roles,
//     };
//   }
//   return {
//     id: found.id,
//     email: found.email,
//     roles: found.roles,
//     club: found?.club,
//   };
// }
// async validate(_accessToken, _refreshToken, profile: Profile) {
//   const { id, name, emails, photos } = profile;
// const { email } = payload;
//   const user = await this.usersService.findByEmail(email);
//   if (!user) {
//     throw new UnauthorizedException();
//   }
//   const roles = user.roles.map(({ name }) => name);
//   return { id: user.id, email: user.email, roles };
//   return {
//     id,
//     firstName: name.givenName,
//     lastName: name.familyName,
//     email: emails[0].value,
//     avatar: photos[0].value,
//     roles: [Role.USER],
//   };
// }
// }

export class GoogleOauthStrategy {}
