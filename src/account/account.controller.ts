import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/types';
import { AccountService } from './account.service';
import { InfoDto } from './dto';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { UserInfo } from 'src/common/types';
import { KeycloakAuthGuard } from 'src/auth/guards';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('account')
@UseGuards(KeycloakAuthGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Patch('info')
  @Roles({ roles: [Role.APP_ADMIN] })
  async updateInformation(
    @AuthenticatedUser() userInfo: UserInfo,
    @Body() infoDto: InfoDto,
  ) {
    await this.accountService.updateInformation(userInfo.id, infoDto);
  }

  @Patch('password')
  @Roles({ roles: [Role.APP_ADMIN] })
  async updatePassword(
    @AuthenticatedUser() userInfo: UserInfo,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.accountService.updatePassword(userInfo.id, updatePasswordDto);
  }
}
