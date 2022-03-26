import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { GetUser } from 'src/common/decorators';
import { CreateUserDto } from 'src/users/dto';
import { User } from 'src/users/entities';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto';
import { GoogleOauthGuard, JwtAuthGuard, JwtRefreshGuard } from './guards';
import { JwtPayload, LoginResponse } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configServer: ConfigService,
  ) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<LoginResponse> {
    const loginResponse = await this.authService.login(authCredentialsDto);
    res.cookie('access_token', loginResponse.accessToken, {
      httpOnly: true,
      expires: new Date(
        Date.now() +
          this.configServer.get<number>('jwt.accessTokenExpiration') * 1000,
      ),
      path: '/',
    });
    res.cookie('refresh_token', loginResponse.refreshToken, {
      httpOnly: true,
      expires: new Date(
        Date.now() +
          this.configServer.get<number>('jwt.refreshTokenExpiration') * 1000,
      ),
      path: '/',
    });

    return loginResponse;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.removeRefreshTokenByUser(user.id);
    res.cookie('access_token', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
      path: '/',
    });
    res.cookie('refresh_token', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
      path: '/',
    });
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  googleAuth() {
    // Guard redirects
  }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const loginResponse = await this.authService.loginWithGoogle(user);
    res.cookie('access_token', loginResponse.accessToken, {
      httpOnly: true,
      expires: new Date(
        Date.now() +
          this.configServer.get<number>('jwt.accessTokenExpiration') * 1000,
      ),
      path: '/',
    });
    res.cookie('refresh_token', loginResponse.refreshToken, {
      httpOnly: true,
      expires: new Date(
        Date.now() +
          this.configServer.get<number>('jwt.refreshTokenExpiration') * 1000,
      ),
      path: '/',
    });

    return loginResponse;
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshAccessToken(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const roles = user.roles.map((role) => role.name);
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      roles,
    };
    const accessToken: string = await this.authService.generateJwtAccessToken(
      payload,
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      expires: new Date(
        Date.now() +
          this.configServer.get<number>('jwt.accessTokenExpiration') * 1000,
      ),
      path: '/',
    });
  }
}
