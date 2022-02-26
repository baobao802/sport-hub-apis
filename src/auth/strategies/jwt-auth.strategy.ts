import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces';
import { UsersRepository } from '../repositories';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtAuthStrategy.extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  private static extractJwtFromCookie(req) {
    if (!req || !req.cookies) return null;
    return req.cookies['access_token'];
  }

  async validate(payload: JwtPayload) {
    const { username } = payload;
    const user = await this.usersRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    const roles = user.roles.map(({ name }) => name);
    return { id: user.id, username: user.username, roles };
  }
}
