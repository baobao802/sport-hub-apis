import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser, Roles } from 'src/common/decorators';
import { Role } from 'src/permission/enum';
import { RolesGuard } from 'src/auth/guards';
import { User } from 'src/user/entities';
import { HubsService } from './hub.service';
import {
  CreatePitchDto,
  HubFilterParams,
  PitchFilterParams,
  UpdateHubDto,
  UpdatePitchDto,
} from './dto';
import { Hub } from './entities';
import { PaginationParams } from 'src/common/dto';

@Controller()
export class HubController {
  constructor(private hubService: HubsService) {}

  @Get('/hubs')
  getHubs(
    @Query() { search, city }: HubFilterParams,
    @Query() { page, size }: PaginationParams,
  ) {
    return this.hubService.findAll({ search, city, page, size });
  }

  @Get('/hubs/mine')
  @Roles(Role.LESSOR)
  @UseGuards(RolesGuard)
  getMyHub(@GetUser() user: User): Promise<Hub> {
    return this.hubService.getMyHub(user);
  }

  @Get('/hubs/:id')
  getHubById(@Param('id') id: string): Promise<Hub> {
    return this.hubService.findById(+id);
  }

  @Patch('/hubs/:id')
  @Roles(Role.LESSOR)
  @UseGuards(RolesGuard)
  updateHubById(@Param('id') id: number, @Body() updateHubDto: UpdateHubDto) {
    return this.hubService.updateHubById(id, updateHubDto);
  }

  @Post('/hubs/:hubId/pitches')
  @Roles(Role.LESSOR)
  @UseGuards(RolesGuard)
  createPitch(
    @Param('hubId') hubId: number,
    @Body() createPitchDto: CreatePitchDto,
  ) {
    return this.hubService.createPitch(hubId, createPitchDto);
  }

  @Get('/available-pitches')
  getAllAvailablePitches(@Query() pitchFilterParams: PitchFilterParams) {
    return this.hubService.findAllAvailablePitches(pitchFilterParams);
  }

  @Patch('/pitches/:id')
  @Roles(Role.LESSOR)
  @UseGuards(RolesGuard)
  updatePitchByHubId(
    @Param('id') id: number,
    @Body() updatePitchDto: UpdatePitchDto,
  ) {
    return this.hubService.updatePitchById(id, updatePitchDto);
  }
}
