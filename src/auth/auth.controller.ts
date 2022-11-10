import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from 'nest-keycloak-connect';
import { GetUser } from 'src/common/decorators';
import { AppUser } from 'src/common/types';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { KeycloakAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('welcome')
  @UseGuards(KeycloakAuthGuard)
  async welcome(@GetUser() user: AppUser) {
    return 'Welcome ' + user.preferred_username;
  }

  @Get('authenticate')
  @UseGuards(KeycloakAuthGuard)
  async authenticate(@Req() request: Request) {
    const accessToken = request.cookies['access_token'];
    return this.authService.authenticate(accessToken);
  }

  @Post('google')
  async loginGoogle(
    @Body('accessToken') accessToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginRes = await this.authService.loginGoogle(accessToken);
    response.cookie('access_token', loginRes.access_token, {
      maxAge: loginRes.expires_in * 1000,
      httpOnly: true,
      sameSite: 'strict',
    });
    response.cookie('refresh_token', loginRes.refresh_token, {
      maxAge: loginRes.refresh_expires_in * 1000,
      httpOnly: true,
      sameSite: 'strict',
    });
    return loginRes;
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginRes = await this.authService.login(loginDto);
    response.cookie('access_token', loginRes.access_token, {
      maxAge: loginRes.expires_in * 1000,
      httpOnly: true,
      sameSite: 'strict',
    });
    response.cookie('refresh_token', loginRes.refresh_token, {
      maxAge: loginRes.refresh_expires_in * 1000,
      httpOnly: true,
      sameSite: 'strict',
    });
    return loginRes;
  }

  @Post('register')
  signup(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('refresh-token')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = request.cookies['access_token'];
    const refreshToken = request.cookies['refresh_token'];
    const tokenResponse = await this.authService.refreshToken(
      accessToken,
      refreshToken,
    );
    response.cookie('access_token', tokenResponse.access_token, {
      maxAge: tokenResponse.expires_in * 1000,
      httpOnly: true,
      sameSite: 'strict',
    });
    response.cookie('refresh_token', tokenResponse.refresh_token, {
      maxAge: tokenResponse.refresh_expires_in * 1000,
      httpOnly: true,
      sameSite: 'strict',
    });
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = request.cookies['access_token'];
    const refreshToken = request.cookies['refresh_token'];

    await this.authService.logout(accessToken, refreshToken);
    response.cookie('access_token', '', {
      maxAge: 0,
      httpOnly: true,
    });
    response.cookie('refresh_token', '', {
      maxAge: 0,
      httpOnly: true,
    });
  }
}
