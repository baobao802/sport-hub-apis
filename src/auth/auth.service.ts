import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from 'src/common/enum';
import { Role } from 'src/permission/enum';
import { CreateUserDto } from 'src/user/dto';
import { User } from 'src/user/entities';
import { UsersService } from 'src/user/users.service';
import { AuthCredentialsDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    try {
      await this.usersService.createOne(createUserDto);
    } catch (error) {
      console.log(error);
      if (error.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException(
          'Email or phone number has already been taken',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;

    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const roles = user.roles.map((role) => role.name);
      const payload: JwtPayload = {
        email: user.email,
        sub: user.id,
        roles,
      };
      const accessToken: string = this.generateJwtAccessToken(payload);
      const refreshToken: string = this.generateJwtRefreshToken(payload);
      this.usersService.setCurrentRefreshToken(refreshToken, user.id);

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles,
          hub: {
            id: user.hub.id,
            name: user.hub.name,
          },
        },
      };
    } else {
      throw new UnauthorizedException('Please check your login credentials!');
    }
  }

  async loginWithGoogle(user: User) {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      roles: user.roles as unknown as Role[],
    };
    const accessToken: string = this.generateJwtAccessToken(payload);
    const refreshToken: string = this.generateJwtRefreshToken(payload);
    this.usersService.setCurrentRefreshToken(refreshToken, user.id);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles as unknown as Role[],
        club: user?.club && {
          id: user.club.id,
          name: user.club.name,
          avatar: user.club.avatar,
        },
      },
    };
  }

  generateJwtAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('jwt.accessTokenExpiration'),
    });
  }

  generateJwtRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('jwt.refreshTokenExpiration'),
    });
  }

  async removeRefreshTokenByUser(userId: string) {
    return this.usersService.removeRefreshToken(userId);
  }
}
