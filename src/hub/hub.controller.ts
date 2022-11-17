import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HubService } from './hub.service';
import {
  CreateHubDto,
  CreatePitchDto,
  HubFilterParams,
  PitchFilterParams,
  UpdateHubDto,
  UpdatePitchDto,
} from './dto';
import { PaginationParams } from 'src/common/dto';
import { UserInfo } from 'src/common/types';
import { AuthenticatedUser, Public, Roles } from 'nest-keycloak-connect';
import { Role } from 'src/auth/types';
import { KeycloakAuthGuard } from 'src/auth/guards';

@Controller()
export class HubController {
  constructor(private hubService: HubService) {}

  @Get('/hubs')
  @Public()
  getHubs(
    @Query() { search, city }: HubFilterParams,
    @Query() { page, size }: PaginationParams,
  ) {
    return this.hubService.findAll({ search, city, page, size });
  }

  @Post('/hubs')
  @Roles({ roles: [Role.APP_ADMIN] })
  @UseGuards(KeycloakAuthGuard)
  createHub(
    @AuthenticatedUser() userInfo: UserInfo,
    @Body() createHubDto: CreateHubDto,
  ) {
    return this.hubService.createHub(userInfo.id, createHubDto);
  }

  @Get('/hubs/mine')
  @Roles({ roles: [Role.APP_ADMIN] })
  @UseGuards(KeycloakAuthGuard)
  getMyHub(@AuthenticatedUser() userInfo: UserInfo) {
    return this.hubService.getMyHub(userInfo);
  }
  @Patch('/hubs/mine')
  @Roles({ roles: [Role.APP_ADMIN] })
  @UseGuards(KeycloakAuthGuard)
  updateMyHubBy(
    @AuthenticatedUser() userInfo: UserInfo,
    @Body() updateHubDto: UpdateHubDto,
  ) {
    return this.hubService.updateMyHubBy(userInfo, updateHubDto);
  }

  @Post('/hubs/mine/pitches')
  @Roles({ roles: [Role.APP_ADMIN] })
  @UseGuards(KeycloakAuthGuard)
  createPitch(
    @AuthenticatedUser() userInfo: UserInfo,
    @Body() createPitchDto: CreatePitchDto,
  ) {
    return this.hubService.createPitch(userInfo, createPitchDto);
  }

  @Get('/hubs/:id')
  @Public()
  getHubById(@Param('id') id: string) {
    return this.hubService.findById(+id);
  }

  // @Get('/available-pitches')
  // getAllAvailablePitches(@Query() pitchFilterParams: PitchFilterParams) {
  //   return this.hubService.findAllAvailablePitches(pitchFilterParams);
  // }

  @Get('/available-pitches')
  @Public()
  getAllAvailablePitches(@Query() pitchFilterParams: PitchFilterParams) {
    return this.hubService.searchForPitches(pitchFilterParams);
  }

  @Patch('/pitches/:id')
  @Roles({ roles: [Role.APP_ADMIN] })
  @UseGuards(KeycloakAuthGuard)
  updatePitchByHubId(
    @AuthenticatedUser() userInfo: UserInfo,
    @Param('id') id: number,
    @Body() updatePitchDto: UpdatePitchDto,
  ) {
    return this.hubService.updatePitchById(userInfo, id, updatePitchDto);
  }

  @Delete('/pitches/:id')
  @Roles({ roles: [Role.APP_ADMIN] })
  @UseGuards(KeycloakAuthGuard)
  deletePitchByHubId(
    @AuthenticatedUser() userInfo: UserInfo,
    @Param('id') id: number,
  ) {
    return this.hubService.deletePitchById(userInfo, id);
  }
}
