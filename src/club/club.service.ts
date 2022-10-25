import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities';
import { UsersService } from 'src/user/users.service';
import { Repository } from 'typeorm';
import { CreateClubDto, UpdateClubDto } from './dto';
import { Club } from './entities';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
    private userService: UsersService,
  ) {}

  async createOne(createClubDto: CreateClubDto, user: User) {
    const { telephone, address, ...rest } = createClubDto;
    const updatedUser = await this.userService.updateProfile(user, {
      address,
      telephone,
    });
    const club = this.clubRepository.create({
      ...rest,
      manager: updatedUser,
    });

    return this.clubRepository.save(club);
  }

  async findById(id: number) {
    const found = this.clubRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException('Club not found');
    }

    return found;
  }

  async findAll() {
    return this.clubRepository.find();
  }

  async updateClub(id: number, updateClubDto: UpdateClubDto) {
    const updatedClub = await this.clubRepository.update(id, updateClubDto);
    if (!updatedClub.affected) {
      throw new NotFoundException('Can not update the club');
    }
  }
}
