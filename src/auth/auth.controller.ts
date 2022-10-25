import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { GetUser } from 'src/common/decorators';
import { CreateUserDto } from 'src/user/dto';
import { User } from 'src/user/entities';
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
    this.handleLoginResponseData(res, loginResponse);
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
      secure: this.configServer.get<boolean>('http.secure'),
    });
    res.cookie('refresh_token', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
      path: '/',
      secure: this.configServer.get<boolean>('http.secure'),
    });
    res.cookie('logged_in', false, {
      httpOnly: false,
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
  @Redirect(process.env.SPORT_HUB_URL)
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const loginResponse = await this.authService.loginWithGoogle(user);
    this.handleLoginResponseData(res, loginResponse);
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

  handleLoginResponseData(res: Response, loginResponse: LoginResponse) {
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
    res.cookie('logged_in', true, {
      httpOnly: false,
      expires: new Date(
        Date.now() +
          this.configServer.get<number>('jwt.refreshTokenExpiration') * 1000,
      ),
      path: '/',
    });
    res.cookie('user', JSON.stringify(loginResponse.user), {
      httpOnly: false,
      expires: new Date(
        Date.now() +
          this.configServer.get<number>('jwt.refreshTokenExpiration') * 1000,
      ),
      path: '/',
    });
  }
}
