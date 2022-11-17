import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Role } from 'src/auth/types';
import { PaginationParams } from 'src/common/dto';
import { Pagination } from 'src/common/interfaces';
import { UserInfo } from 'src/common/types';
import { EmailService } from 'src/email/email.service';
import { HubService } from 'src/hub/hub.service';
import { createPaginationResponse } from 'src/utils';
import { FindManyOptions, Repository } from 'typeorm';
import { BookingDto, BookingFilterParams } from './dto';
import { Booking } from './entities';
import { BookingStatus } from './types';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @Inject(forwardRef(() => HubService))
    private hubService: HubService,
    private schedulerRegistry: SchedulerRegistry,
    private emailService: EmailService,
  ) {}

  async createOne(bookingDto: BookingDto, userInfo: UserInfo) {
    const pitch = await this.hubService.findPitchById(bookingDto.pitchId);
    const booking = this.bookingRepository.create({
      customerId: userInfo.id,
      customerInfo: userInfo,
      pitch,
      cityId: bookingDto.cityId,
      cost: bookingDto.cost,
      time: bookingDto.time,
      status: BookingStatus.DONE,
      date: bookingDto.date,
    });
    const createdBooking = await this.bookingRepository.save(booking);
    const date = moment(
      `${booking.date}, ${booking.time.split(' - ')[0]}`,
      'DD/MM/YYYY, HH:mm',
    ).subtract(30, 'minute');
    const job = new CronJob(date, () => {
      this.emailService.sendMail({
        from: 'schedule@sporthub.com',
        to: userInfo.email,
        subject: 'Nhắc nhở lịch đặt sân.',
        text: `Bạn có lịch đặt sân bóng vào lúc ${date.format(
          'HH:mm, DD/MM/YYYY',
        )}`,
      });
    });

    this.schedulerRegistry.addCronJob(String(createdBooking.id), job);
    job.start();
    return createdBooking;
  }

  async findAll(
    options: BookingFilterParams & PaginationParams,
    userInfo?: UserInfo,
  ): Promise<Pagination<Booking>> {
    const { cityId, status, date, pitchId, page = 1, size = 20 } = options;
    const findOptions: FindManyOptions<Booking> = {
      where: {
        date,
        cityId,
        pitch: { id: pitchId },
        status,
      },
    };

    if (userInfo && _.includes(userInfo.roles, Role.APP_USER) && !_.includes(userInfo.roles, Role.APP_ADMIN)) {
      findOptions.where = { ...findOptions.where, customerId: userInfo.id };
      findOptions.relations = { pitch: { hub: true } };
    }
    if (userInfo && _.includes(userInfo.roles, Role.APP_ADMIN)) {
      findOptions.where = {
        ...findOptions.where,
        pitch: {
          hub: { ownerId: userInfo.id },
        },
      };
      findOptions.relations = { pitch: true };
    }
    const [bookings, count] = await this.bookingRepository.findAndCount({
      order: { createdAt: 'DESC' },
      ...findOptions,
      skip: (page - 1) * size,
      take: size,
      withDeleted: status === BookingStatus.DONE ? false : true,
    });

    return createPaginationResponse(bookings, count, page, size);
  }

  async cancelBooking(bookingId: number, userInfo: UserInfo) {
    const found = await this.bookingRepository.findOneBy({ id: bookingId });

    if (!found) {
      throw new NotFoundException('The booking not found');
    }

    const dateBooked = moment(
      `${found.date}, ${found.time.split(' - ')[0]}`,
      'DD/MM/YYYY, HH:mm',
    ).subtract(30, 'minute');
    if (dateBooked <= moment()) {
      throw new NotAcceptableException('Đã quá thời gian hủy cho phép');
    }

    const deleteRes = await this.bookingRepository.update(
      { customerId: userInfo.id, id: bookingId },
      { status: BookingStatus.CANCEL, deletedAt: new Date() },
    );

    if (!deleteRes.affected) {
      throw new BadRequestException('Can not cancel the booking');
    }

    this.schedulerRegistry.getCronJob(String(bookingId)).stop();
  }
}
