// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { Request } from 'express';
// import * as bcrypt from 'bcrypt';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { UsersService } from 'src/user/users.service';
// import { JwtPayload } from '../interfaces';

// @Injectable()
// export class JwtRefreshStrategy extends PassportStrategy(
//   Strategy,
//   'jwt-refresh-token',
// ) {
// constructor(
//   private usersService: UsersService,
//   private configService: ConfigService,
// ) {
//   super({
//     jwtFromRequest: ExtractJwt.fromExtractors([
//       JwtRefreshStrategy.extractJwtFromCookie,
//       ExtractJwt.fromAuthHeaderAsBearerToken(),
//     ]),
//     secretOrKey: configService.get<string>('jwt.secret'),
//     passReqToCallback: true,
//     usernameField: 'email',
//   });
// }
// private static extractJwtFromCookie(req) {
//   if (!req || !req.cookies) return null;
//   return req.cookies['refresh_token'];
// }
// async validate(req: Request, payload: JwtPayload) {
//   const { email } = payload;
//   const user = await this.usersService.findByEmail(email);
//   if (!user) {
//     throw new UnauthorizedException();
//   }
//   const refreshToken = req.cookies['refresh_token'];
//   const isRefreshTokenMatching = await bcrypt.compare(
//     refreshToken,
//     user.currentHashedRefreshToken,
//   );
//   if (!isRefreshTokenMatching) {
//     return;
//   }
//   const roles = user.roles.map(({ name }) => name);
//   return { id: user.id, email: user.email, roles };
// }
// }

export class JwtRefreshStrategy {}
