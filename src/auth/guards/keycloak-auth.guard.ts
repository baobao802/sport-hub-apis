import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../auth.service';

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // const header = request.header('Authorization');
    // if (!header) {
    //   throw new HttpException(
    //     'Authorization: Bearer <token> header missing',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

    // const parts = header.split(' ');
    // if (parts.length !== 2 || parts[0] !== 'Bearer') {
    //   throw new HttpException(
    //     'Authorization: Bearer <token> header invalid',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

    // const token = parts[1];
    const accessToken = request.cookies['access_token'];
    const refreshToken = request.cookies['refresh_token'];
    if (!accessToken && refreshToken) {
      throw new UnauthorizedException('Token expired');
    }
    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      request['user'] = await this.authService.authenticate(accessToken);
      // request['user'] = jwt.decode(accessToken);
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
