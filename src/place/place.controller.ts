import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreateCityDto, CreateDistrictDto, ImportPlacesDto } from './dto';
import { City, District } from './entities';
import { Public } from 'nest-keycloak-connect';

@Controller('places')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @Post('/import')
  @Public()
  importPlaceData(@Body() importPlacesDto: ImportPlacesDto) {
    return this.placeService.importPlaceData(importPlacesDto);
  }

  @Get('/cities')
  @Public()
  getCities(): Promise<City[]> {
    return this.placeService.getCities();
  }

  @Post('/cities')
  @Public()
  createCity(@Body() createCityDto: CreateCityDto): Promise<City> {
    return this.placeService.createCity(createCityDto);
  }

  @Get('/:cityId/districts')
  @Public()
  getDistricts(@Param('cityId') cityId: string): Promise<District[]> {
    return this.placeService.getDistricts(+cityId);
  }

  @Post('/districts')
  @Public()
  createDistrict(
    @Body() createDistrictDto: CreateDistrictDto,
  ): Promise<District> {
    return this.placeService.createDistrict(createDistrictDto);
  }

  @Delete('/cities/:id')
  @Public()
  deleteCity(@Param('id') id: string) {
    return this.placeService.deleteCity(id);
  }
}
