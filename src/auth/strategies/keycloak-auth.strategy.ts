import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { UserInfo } from 'src/common/types';
import { RegisterDto } from '../dto';
import { KeycloakUserInfoResponse, LoginParams, TokenResponse } from '../types';

@Injectable()
export class KeycloakAuthStrategy {
  private baseAuthUrl: string;
  private baseAdminUrl: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.baseAuthUrl = `${process.env.KC_AUTH_SERVER_URL}/realms/${process.env.KC_REALM}/protocol/openid-connect`;
    this.baseAdminUrl = `${process.env.KC_AUTH_SERVER_URL}/admin/realms/${process.env.KC_REALM}`;
  }

  async authenticate(accessToken: string): Promise<UserInfo> {
    try {
      const url = `${this.baseAuthUrl}/userinfo`;
      const response =
        await this.httpService.axiosRef.get<KeycloakUserInfoResponse>(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      const userID = response.data.sub;

      const userURL = `${this.baseAdminUrl}/users/${userID}`;
      const tokenRes = await this.getAdminAccessToken();
      const userResponse = await this.httpService.axiosRef.get(userURL, {
        headers: {
          Authorization: `Bearer ${tokenRes.data.access_token}`,
        },
      });
      const decodedAT = jwt.decode(accessToken);

      return {
        id: userResponse.data.id,
        username: userResponse.data.username,
        givenName: userResponse.data.firstName,
        familyName: userResponse.data.lastName,
        telephone: userResponse.data?.attributes?.telephone[0],
        roles: _.get(decodedAT, 'resource_access.sport-hub.roles'),
        email: userResponse.data.email,
        emailVerified: userResponse.data.emailVerified,
        enabled: userResponse.data.enabled,
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error.message);
    }
  }

  async login(params: LoginParams): Promise<TokenResponse> {
    const url = `${this.baseAuthUrl}/token`;
    try {
      return (
        await this.httpService.axiosRef.post<TokenResponse>(
          url,
          new URLSearchParams(params),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
      ).data;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error.response.data?.error_description);
    }
  }

  async register(registerDto: RegisterDto): Promise<void> {
    const registerURL = `${this.baseAdminUrl}/users`;
    const tokenRes = await this.getAdminAccessToken();
    try {
      await this.httpService.axiosRef.post<TokenResponse>(
        registerURL,
        {
          enabled: true,
          username: registerDto.username,
          firstName: registerDto.givenName,
          lastName: registerDto.familyName,
          email: registerDto.email,
          credentials: [
            {
              type: 'password',
              value: registerDto.password,
              temporary: false,
            },
          ],
          attributes: {
            telephone: registerDto.telephone,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${tokenRes.data.access_token}`,
          },
        },
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.response.data?.errorMessage);
    }
    const createdUser = await this.getUserByUsername(
      tokenRes.data.access_token,
      registerDto.username,
    );

    await this.assignRoles(
      tokenRes.data.access_token,
      createdUser.id,
      registerDto.roles,
    );
  }

  async logout(accessToken: string, refreshToken: string) {
    try {
      const logoutURL = `${this.baseAuthUrl}/logout`;
      await this.httpService.axiosRef.post(
        logoutURL,
        new URLSearchParams({
          refresh_token: refreshToken,
          client_id: this.configService.get('kc.clientId'),
          client_secret: this.configService.get('kc.secret'),
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      // console.log(error);
      throw new BadRequestException(error);
    }
  }

  async refreshToken(accessToken: string, refreshToken: string) {
    const url = `${this.baseAuthUrl}/token`;
    try {
      return (
        await this.httpService.axiosRef.post<TokenResponse>(
          url,
          new URLSearchParams({
            client_id: this.configService.get('kc.clientId'),
            client_secret: this.configService.get('kc.secret'),
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              // Authorization: `Bearer ${accessToken}`,
            },
          },
        )
      ).data;
    } catch (error) {
      throw new UnauthorizedException(error.response.data?.error_description);
    }
  }

  async getAdminAccessToken() {
    try {
      const tokenURL = `${this.baseAuthUrl}/token`;
      return await this.httpService.axiosRef.post<TokenResponse>(
        tokenURL,
        new URLSearchParams({
          client_id: this.configService.get('kc.clientId'),
          client_secret: this.configService.get('kc.secret'),
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async getUserByUsername(accessToken: string, username: string) {
    try {
      const userURL = `${this.baseAdminUrl}/users?username=${username}`;
      return (
        await this.httpService.axiosRef.get<any>(userURL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data[0];
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async assignRoles(accessToken: string, userID: string, roles: any) {
    try {
      const roleMappingURL = `${this.baseAdminUrl}/users/${userID}/role-mappings/clients/${process.env.KC_CLIENT_UUID}`;

      await this.httpService.axiosRef.post(roleMappingURL, roles, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
