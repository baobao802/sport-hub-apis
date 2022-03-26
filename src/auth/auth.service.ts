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
import { CreateUserDto } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';
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
      await this.usersService.create(createUserDto);
    } catch (error) {
      if (error.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('Email has already been taken.');
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
      const accessToken: string = await this.generateJwtAccessToken(payload);
      const refreshToken: string = await this.generateJwtRefreshToken(payload);
      this.usersService.setCurrentRefreshToken(refreshToken, user.id);
      return { accessToken, refreshToken, email: user.email, userId: user.id };
    } else {
      throw new UnauthorizedException('Please check your login credentials!');
    }
  }

  async loginWithGoogle(user) {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };
    const accessToken: string = await this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('jwt.accessTokenExpiration'),
    });
    const refreshToken: string = await this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('jwt.refreshTokenExpiration'),
    });
    return { accessToken, refreshToken, email: user.email, userId: user.id };
  }

  async generateJwtAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('jwt.accessTokenExpiration'),
    });
  }

  async generateJwtRefreshToken(payload: JwtPayload): Promise<string> {
    return await this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('jwt.refreshTokenExpiration'),
    });
  }

  async removeRefreshTokenByUser(userId: string) {
    return this.usersService.removeRefreshToken(userId);
  }
}
