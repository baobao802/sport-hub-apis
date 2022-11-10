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
import { GetUser } from 'src/common/decorators';
import { HubService } from './hub.service';
import {
  CreateHubDto,
  CreatePitchDto,
  HubFilterParams,
  PitchFilterParams,
  UpdateHubDto,
  UpdatePitchDto,
} from './dto';
import { Hub } from './entities';
import { PaginationParams } from 'src/common/dto';
import { AppUser } from 'src/common/types';
import { Public, Roles } from 'nest-keycloak-connect';
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
  @Public()
  @UseGuards(KeycloakAuthGuard)
  createHub(@GetUser() user: AppUser, @Body() createHubDto: CreateHubDto) {
    return this.hubService.createHub(user.sub, createHubDto);
  }

  @Get('/hubs/mine')
  // @Roles({ roles: [Role.APP_ADMIN] })
  @Public()
  @UseGuards(KeycloakAuthGuard)
  getMyHub(@GetUser() user: AppUser) {
    return this.hubService.getMyHub(user);
  }
  @Patch('/hubs/mine')
  // @Roles({ roles: [Role.APP_ADMIN] })
  @Public()
  @UseGuards(KeycloakAuthGuard)
  updateMyHubBy(@GetUser() user: AppUser, @Body() updateHubDto: UpdateHubDto) {
    return this.hubService.updateMyHubBy(user, updateHubDto);
  }

  @Post('/hubs/mine/pitches')
  // @Roles({ roles: [Role.APP_ADMIN] })
  @Public()
  @UseGuards(KeycloakAuthGuard)
  createPitch(
    @GetUser() user: AppUser,
    @Body() createPitchDto: CreatePitchDto,
  ) {
    return this.hubService.createPitch(user, createPitchDto);
  }

  @Get('/hubs/:id')
  @Public()
  getHubById(@Param('id') id: string) {
    return this.hubService.findById(+id);
  }

  // @Get('/available-pitches')
  // @Public()
  // getAllAvailablePitches(@Query() pitchFilterParams: PitchFilterParams) {
  //   return this.hubService.findAllAvailablePitches(pitchFilterParams);
  // }

  @Get('/available-pitches')
  @Public()
  getAllAvailablePitches(@Query() pitchFilterParams: PitchFilterParams) {
    return this.hubService.searchForPitches(pitchFilterParams);
  }

  @Patch('/pitches/:id')
  // @Roles({ roles: [Role.APP_ADMIN] })
  @Public()
  @UseGuards(KeycloakAuthGuard)
  updatePitchByHubId(
    @GetUser() user: AppUser,
    @Param('id') id: number,
    @Body() updatePitchDto: UpdatePitchDto,
  ) {
    return this.hubService.updatePitchById(user, id, updatePitchDto);
  }

  @Delete('/pitches/:id')
  // @Roles({ roles: [Role.APP_ADMIN] })
  @Public()
  @UseGuards(KeycloakAuthGuard)
  deletePitchByHubId(@GetUser() user: AppUser, @Param('id') id: number) {
    return this.hubService.deletePitchById(user, id);
  }
}
