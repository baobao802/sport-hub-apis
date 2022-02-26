import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthCredentialsDto } from '../dto';
import { GoogleOauthGuard } from '../guards';
import { LoginResponse } from '../interfaces';
import { Role } from '../entities';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configServer: ConfigService,
  ) {}

  @Post('signup')
  signup(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signup(authCredentialsDto);
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
        Date.now() + this.configServer.get<number>('jwt.expiration') * 1000,
      ),
    });

    return loginResponse;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
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
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const loginResponse = await this.authService.loginWithGoogle(req.user);
    res.cookie('access_token', loginResponse.accessToken, {
      httpOnly: true,
      expires: new Date(
        Date.now() + this.configServer.get<number>('jwt.expiration') * 1000,
      ),
    });

    return loginResponse;
  }

  @Post('roles')
  createRole(@Body() role: Role): Promise<Role> {
    return this.authService.createRole(role);
  }

  @Get('roles')
  getRoles(): Promise<Role[]> {
    return this.authService.getRoles();
  }
}
