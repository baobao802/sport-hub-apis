import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/permission/enum';
import { PlaceService } from './place.service';
import { CreateCityDto, CreateDistrictDto, ImportPlacesDto } from './dto';
import { City, District } from './entities';

@Controller('places')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @UseGuards(RolesGuard)
  @Post('/import')
  importPlaceData(@Body() importPlacesDto: ImportPlacesDto) {
    return this.placeService.importPlaceData(importPlacesDto);
  }

  @Get('/cities')
  getCities(): Promise<City[]> {
    return this.placeService.getCities();
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('/cities')
  createCity(@Body() createCityDto: CreateCityDto): Promise<City> {
    return this.placeService.createCity(createCityDto);
  }

  @Get('/:cityId/districts')
  getDistricts(@Param('cityId') cityId: string): Promise<District[]> {
    return this.placeService.getDistricts(+cityId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('/districts')
  createDistrict(
    @Body() createDistrictDto: CreateDistrictDto,
  ): Promise<District> {
    return this.placeService.createDistrict(createDistrictDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete('/cities/:id')
  deleteCity(@Param('id') id: string) {
    return this.placeService.deleteCity(id);
  }
}
