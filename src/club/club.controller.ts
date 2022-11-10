import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards';
import { GetUser, Roles } from 'src/common/decorators';
import { AppUser } from 'src/common/types';
import { Role } from 'src/permission/enum';
import { ClubService } from './club.service';
import { CreateClubDto, UpdateClubDto } from './dto';

@Controller('/clubs')
export class ClubController {
  constructor(private clubService: ClubService) {}

  @Get()
  getAllClubs() {
    return this.clubService.findAll();
  }

  @Get(':id')
  getClubById(@Param('id') id: number) {
    return this.clubService.findById(id);
  }

  @Post()
  @Roles(Role.CUSTOMER)
  @UseGuards(RolesGuard)
  createClub(@Body() createClubDto: CreateClubDto, @GetUser() user: AppUser) {
    return this.clubService.createOne(createClubDto, user);
  }

  @Patch(':id')
  @Roles(Role.CUSTOMER)
  @UseGuards(RolesGuard)
  updateClub(@Param('id') id: number, @Body() updateClubDto: UpdateClubDto) {
    return this.clubService.updateClub(id, updateClubDto);
  }
}
