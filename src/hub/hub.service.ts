import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as _ from 'lodash';
import {
  CreateHubDto,
  CreatePitchDto,
  HubFilterParams,
  PitchFilterParams,
  UpdateHubDto,
  UpdatePitchDto,
} from './dto';
import { Hub, Pitch } from './entities';
import { Equal, ILike, In, Repository } from 'typeorm';
import { Pagination } from 'src/common/interfaces';
import { PaginationParams } from 'src/common/dto';
import { createPaginationResponse } from 'src/utils';
import { BookingService } from 'src/booking/booking.service';
import { BookingStatus } from 'src/booking/types';
import * as moment from 'moment';
import { AppUser } from 'src/common/types';
import { AccountService } from 'src/account/account.service';
import PitchSearchService from './pitchSearch.service';

@Injectable()
export class HubService {
  private readonly logger = new Logger(HubService.name);

  constructor(
    @InjectRepository(Hub)
    private hubRepository: Repository<Hub>,
    @InjectRepository(Pitch)
    private pitchRepository: Repository<Pitch>,
    @Inject(forwardRef(() => BookingService))
    private bookingService: BookingService,
    private accountService: AccountService,
    private pitchSearchService: PitchSearchService,
  ) {}

  async searchForPitches(options: PitchFilterParams) {
    const { search = '', cityId } = options;
    const results = await this.pitchSearchService.search(search);
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return [];
    }
    return await this.pitchRepository.find({
      where: {
        id: In(ids),
        hub: {
          address: {
            district: {
              city: {
                id: Equal(cityId),
              },
            },
          },
        },
      },
      relations: { hub: true },
    });
  }

  async findAll(
    options: HubFilterParams & PaginationParams,
  ): Promise<Pagination<Hub>> {
    const { search = '', city, page = 1, size = 10 } = options;
    const [hubs, count] = await this.hubRepository.findAndCount({
      where: [
        {
          name: ILike(`%${search}%`),
          address: {
            district: {
              city: {
                name: city,
              },
            },
          },
        },
      ],
      skip: (page - 1) * size,
      take: size,
    });

    return createPaginationResponse(hubs, count, page, size);
  }

  async findById(id: number) {
    const found = await this.hubRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException('The hub not found');
    }

    const owner = await this.accountService.getUserById(found.ownerId);

    return {
      ...found,
      owner: {
        id: owner.id,
        username: owner.username,
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        telephone: owner.attributes?.telephone[0],
      },
    };
  }

  async getMyHub(user: AppUser): Promise<Hub> {
    const found = await this.hubRepository.findOneBy({ ownerId: user.sub });

    if (!found) {
      throw new NotFoundException('Your hub not found');
    }

    return found;
  }

  async createHub(ownerId: string, createHubDto: CreateHubDto) {
    const hub = this.hubRepository.create({ ownerId, ...createHubDto });
    return this.hubRepository.save(hub);
  }

  async updateMyHubBy(user: AppUser, updateHubDto: UpdateHubDto) {
    const found = await this.getMyHub(user);
    return this.hubRepository.save({ ...found, ...updateHubDto });
  }

  async createPitch(user: AppUser, createPitchDto: CreatePitchDto) {
    const hub = await this.getMyHub(user);
    const pitch = this.pitchRepository.create({
      ...createPitchDto,
      hub,
    });
    const createdPitch = await this.pitchRepository.save(pitch);
    await this.pitchSearchService.indexPitch(createdPitch);
    return createdPitch;
  }

  async findAllAvailablePitches(options: PitchFilterParams & PaginationParams) {
    const { cityId, date, time, type, search } = options;
    const pitches = await this.pitchRepository.find({
      where: [
        {
          hub: {
            address: {
              district: {
                city: {
                  id: Equal(cityId),
                },
              },
            },
          },
        },
      ],
      relations: {
        hub: true,
      },
    });
    const successBookings = await this.bookingService.findAll({
      status: BookingStatus.DONE,
      date,
    });
    const groupSuccessBookings = _.groupBy(successBookings.items, 'pitch.id');

    const availablePitches = _.filter(pitches, (pitch) => {
      if (type && pitch.type !== type) {
        return false;
      }

      if (
        search &&
        !_.includes(_.lowerCase(pitch.hub.name), _.lowerCase(String(search)))
      ) {
        return false;
      }

      if (time) {
        const foundTime = _.find(pitch.cost, ({ time: t }) => t === time);
        if (!foundTime) {
          return false;
        }
        const [h, m] = String(time).split(' - ')[0].split(':');
        const overtime =
          moment(date, 'DD/MM/YYYY')
            .hour(Number(h))
            .minute(Number(m))
            .valueOf() < moment().valueOf();
        if (overtime) {
          return false;
        }
        const booked = _.find(
          _.get(groupSuccessBookings, pitch.id) || [],
          (b) => b.time === time,
        );
        return !booked;
      }

      const available = _.some(pitch.cost, ({ time: t }) => {
        const hm = String(t).split(' - ')[0].split(':');
        const overtime =
          moment(date, 'DD/MM/YYYY')
            .hour(Number(hm[0]))
            .minute(Number(hm[1]))
            .valueOf() < moment().valueOf();
        const booked = _.find(
          _.get(groupSuccessBookings, pitch.id) || [],
          (b) => b.time === t,
        );
        return !booked && !overtime;
      });
      return available;
    });

    return availablePitches;
  }

  async findPitchById(id: number) {
    const found = await this.pitchRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException('The pitch not found');
    }
    return found;
  }

  async updatePitchById(
    user: AppUser,
    id: number,
    updatePitchDto: UpdatePitchDto,
  ) {
    const found = await this.pitchRepository.findOneBy({
      id,
      hub: { ownerId: user.sub },
    });
    if (!found) {
      throw new NotFoundException('The pitch not found');
    }
    await this.pitchRepository.save({ ...found, ...updatePitchDto });
    await this.pitchSearchService.update({ ...found, ...updatePitchDto });
  }

  async deletePitchById(user: AppUser, id: number): Promise<void> {
    const deleteRes = await this.pitchRepository.softDelete({
      id,
      hub: { ownerId: user.sub },
    });

    if (!deleteRes.affected) {
      throw new NotFoundException('The hub not found');
    }
    await this.pitchSearchService.remove(id);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.logger.debug('Called every 10 minutes');
  }
}
