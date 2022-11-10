import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { Role } from 'src/permission/enum';
import { AccountService } from './account.service';
import { InfoDto } from './dto';
import { Roles } from 'nest-keycloak-connect';
import { GetUser } from 'src/common/decorators';
import { AppUser } from 'src/common/types';
import { KeycloakAuthGuard } from 'src/auth/guards';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('account')
@UseGuards(KeycloakAuthGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Patch('info')
  // @Roles({ roles: [Role.ADMIN] })
  async updateInformation(@GetUser() user: AppUser, @Body() infoDto: InfoDto) {
    await this.accountService.updateInformation(user.sub, infoDto);
  }

  @Patch('password')
  // @Roles({ roles: [Role.ADMIN] })
  async updatePassword(
    @GetUser() user: AppUser,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.accountService.updatePassword(user.sub, updatePasswordDto);
  }
}
