import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from 'src/user/entities';
import { CreateOfficeDto, OfficeFilterParams } from './dto';
import { OfficeStatus } from './enum';
import { Office } from './entities';
import { ILike, Repository } from 'typeorm';
import { Pagination } from 'src/common/interfaces';
import { PaginationParams } from 'src/common/dto';
import { createPaginationResponse } from 'src/utils';

@Injectable()
export class OfficesService {
  private readonly logger = new Logger(OfficesService.name);

  constructor(
    @InjectRepository(Office)
    private officesRepository: Repository<Office>,
  ) {}

  async findAll(
    options: OfficeFilterParams & PaginationParams,
  ): Promise<Pagination<Office>> {
    const { status, search = '', page = 1, size = 10 } = options;
    const [offices, count] = await this.officesRepository.findAndCount({
      where: [{ status }, { status, name: ILike(`%${search}%`) }],
      skip: (page - 1) * size,
      take: size,
    });

    return createPaginationResponse(offices, count, page, size);
  }

  createOne(createOfficeDto: CreateOfficeDto, user: User): Promise<Office> {
    const office = this.officesRepository.create({
      ...createOfficeDto,
      status: OfficeStatus.CLOSE,
      managerStuff: user,
    });

    return this.officesRepository.save(office);
  }

  async findById(id: number): Promise<Office> {
    const found = await this.officesRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException('The office not found');
    }

    return found;
  }

  async getMyOffices(user: User): Promise<Office[]> {
    const found = await this.officesRepository.find({
      where: {
        managerStuff: {
          id: user.id,
        },
      },
    });

    if (!found) {
      throw new NotFoundException('Your offices not found');
    }

    return found;
  }

  async getMyOfficeById(id: number, user: User): Promise<Office> {
    const found = await this.officesRepository.findOne({
      where: {
        id,
        managerStuff: {
          id: user.id,
        },
      },
    });

    if (!found) {
      throw new NotFoundException('The office not found');
    }

    return found;
  }

  async deleteOne(id: number): Promise<void> {
    const deleteRes = await this.officesRepository.softDelete(id);

    if (!deleteRes.affected) {
      throw new NotFoundException('The office not found');
    }
  }

  async restore(id: number): Promise<void> {
    const restoreRes = await this.officesRepository.restore(id);

    if (!restoreRes.affected) {
      throw new NotFoundException('The office not found');
    }
  }

  async updateMyOfficeStatus(
    id: number,
    status: OfficeStatus,
    user: User,
  ): Promise<Office> {
    const office = await this.getMyOfficeById(id, user);

    office.status = status;
    await this.officesRepository.save(office);

    return office;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.logger.debug('Called every 10 minutes');
  }
}
