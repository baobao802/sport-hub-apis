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
import { User } from 'src/user/entities';
import {
  CreatePitchDto,
  HubFilterParams,
  PitchFilterParams,
  UpdateHubDto,
  UpdatePitchDto,
} from './dto';
import { Hub, Pitch } from './entities';
import { Equal, ILike, Repository } from 'typeorm';
import { Pagination } from 'src/common/interfaces';
import { PaginationParams } from 'src/common/dto';
import { createPaginationResponse } from 'src/utils';
import { BookingService } from 'src/booking/booking.service';
import { BookingStatus } from 'src/booking/types';
import * as moment from 'moment';

@Injectable()
export class HubsService {
  private readonly logger = new Logger(HubsService.name);

  constructor(
    @InjectRepository(Hub)
    private hubRepository: Repository<Hub>,
    @InjectRepository(Pitch)
    private pitchRepository: Repository<Pitch>,
    @Inject(forwardRef(() => BookingService))
    private bookingService: BookingService,
  ) {}

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
                name: Equal(city),
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

  async findById(id: number): Promise<Hub> {
    const found = await this.hubRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException('The hub not found');
    }

    return found;
  }

  async getMyHub(user: User): Promise<Hub> {
    const found = await this.hubRepository.findOneBy({
      owner: {
        id: user.id,
      },
    });

    if (!found) {
      throw new NotFoundException('Your hub not found');
    }

    return found;
  }

  async updateHubById(id: number, updateHubDto: UpdateHubDto) {
    const found = await this.findById(id);
    return this.hubRepository.save({ ...found, ...updateHubDto });
  }

  async createPitch(hubId: number, createPitchDto: CreatePitchDto) {
    const hub = await this.findById(hubId);
    const pitch = this.pitchRepository.create({
      ...createPitchDto,
      hub,
    });
    return this.pitchRepository.save(pitch);
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

  async updatePitchById(id: number, updatePitchDto: UpdatePitchDto) {
    const pitchRes = await this.pitchRepository.update(id, updatePitchDto);

    if (!pitchRes.affected) {
      throw new NotFoundException('The pitch not found');
    }
  }

  async deleteOne(id: number): Promise<void> {
    const deleteRes = await this.hubRepository.softDelete(id);

    if (!deleteRes.affected) {
      throw new NotFoundException('The hub not found');
    }
  }

  async restore(id: number): Promise<void> {
    const restoreRes = await this.hubRepository.restore(id);

    if (!restoreRes.affected) {
      throw new NotFoundException('The hub not found');
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.logger.debug('Called every 10 minutes');
  }
}
