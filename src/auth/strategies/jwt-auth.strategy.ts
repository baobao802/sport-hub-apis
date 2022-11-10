// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { UsersService } from 'src/user/users.service';
// import { JwtPayload } from '../interfaces';

// @Injectable()
// export class JwtAuthStrategy extends PassportStrategy(Strategy) {
// constructor(
//   // private usersService: UsersService,
//   private configService: ConfigService,
// ) {
//   super({
//     jwtFromRequest: ExtractJwt.fromExtractors([
//       JwtAuthStrategy.extractJwtFromCookie,
//       ExtractJwt.fromAuthHeaderAsBearerToken(),
//     ]),
//     secretOrKey: configService.get<string>('jwt.secret'),
//     usernameField: 'email',
//   });
// }
// private static extractJwtFromCookie(req) {
//   if (!req || !req.cookies) return null;
//   return req.cookies['access_token'];
// }
// async validate(payload: JwtPayload) {
//   const { email } = payload;
//   // const user = await this.usersService.findByEmail(email);
//   // if (!user) {
//   //   throw new UnauthorizedException();
//   // }
//   // const roles = user.roles.map(({ name }) => name);
//   // return { id: user.id, email: user.email, roles, clubId: user?.club?.id };
// }
// }

export class JwtAuthStrategy {}
