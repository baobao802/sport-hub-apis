import { ImportPlacesDto } from './dto/import-places.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCityDto, CreateDistrictDto } from './dto';
import { City, District } from './entities';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(District)
    private districtsRepository: Repository<District>,
    @InjectRepository(City)
    private citesRepository: Repository<City>,
  ) {}

  async getCities(): Promise<City[]> {
    return this.citesRepository.find();
  }

  async importPlaceData(importPlacesDto: ImportPlacesDto): Promise<City[]> {
    const results: City[] = [];

    await this.citesRepository.clear();
    for (const city of importPlacesDto.cities) {
      const createdCity = await this.citesRepository.save({
        name: city.name,
        districts: city.districts,
      });
      results.push(createdCity);
    }
    return results;
  }

  async createCity(createCityDto: CreateCityDto): Promise<City> {
    const { name } = createCityDto;

    const found = await this.citesRepository.findOneBy({ name });
    if (found) {
      throw new ConflictException('City has already been taken.');
    }

    const city = this.citesRepository.create({
      name,
    });
    return this.citesRepository.save(city);
  }

  deleteCity(id: string) {
    return this.citesRepository.delete(+id);
  }

  async createDistrict(
    createDistrictDto: CreateDistrictDto,
  ): Promise<District> {
    const { name, cityId } = createDistrictDto;

    const foundCity = await this.citesRepository.findOneBy({ id: cityId });
    if (!foundCity) {
      throw new NotFoundException(`City with ID "${cityId}" not found.`);
    }

    const foundDistrict = await this.districtsRepository.findOneBy({ name });
    if (foundDistrict) {
      throw new ConflictException('District has already been taken.');
    }

    const district = this.districtsRepository.create({
      name,
      city: foundCity,
    });
    return this.districtsRepository.save(district);
  }

  async getDistricts(cityId: number): Promise<District[]> {
    return this.districtsRepository.findBy({
      city: {
        id: cityId,
      },
    });
  }
}
