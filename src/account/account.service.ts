import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InfoDto } from './dto';
import { HttpService } from '@nestjs/axios';
import { TokenResponse } from 'src/auth/types';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AccountService {
  constructor(private httpService: HttpService) {}

  async updateInformation(userID: string, infoDto: InfoDto) {
    const tokenResponse = await this.getAdminAccessToken();
    try {
      const userURL = `${process.env.KC_AUTH_SERVER_URL}/admin/realms/${process.env.KC_REALM}/users/${userID}`;

      await this.httpService.axiosRef.put(
        userURL,
        {
          firstName: infoDto.givenName,
          lastName: infoDto.familyName,
          email: infoDto.email,
          attributes: {
            telephone: [infoDto.telephone],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
          },
        },
      );
    } catch (error) {
      throw new BadRequestException(error.response.data?.errorMessage);
    }
  }

  async updatePassword(userID: string, updatePasswordDto: UpdatePasswordDto) {
    const tokenResponse = await this.getAdminAccessToken();
    try {
      const passwordURL = `${process.env.KC_AUTH_SERVER_URL}/admin/realms/${process.env.KC_REALM}/users/${userID}/reset-password`;

      await this.httpService.axiosRef.put(
        passwordURL,
        {
          type: 'password',
          value: updatePasswordDto.newPassword,
          temporary: false,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
          },
        },
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.response.data?.errorMessage);
    }
  }

  async getUserById(userID: string) {
    const tokenResponse = await this.getAdminAccessToken();
    try {
      const userURL = `${process.env.KC_AUTH_SERVER_URL}/admin/realms/${process.env.KC_REALM}/users/${userID}`;
      return (
        await this.httpService.axiosRef.get(userURL, {
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
          },
        })
      ).data;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async getAdminAccessToken() {
    try {
      const tokenURL = `${process.env.KC_AUTH_SERVER_URL}/realms/${process.env.KC_REALM}/protocol/openid-connect/token`;
      return await this.httpService.axiosRef.post<TokenResponse>(
        tokenURL,
        new URLSearchParams({
          client_id: process.env.KC_CLIENT_ID,
          client_secret: process.env.KC_SECRET,
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
