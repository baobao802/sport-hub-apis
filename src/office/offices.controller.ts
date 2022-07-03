import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/common/decorators';
import { Role } from 'src/permission/enum';
import { Roles } from 'src/common/decorators';
import { RolesGuard } from 'src/auth/guards';
import { User } from 'src/user/entities';
import { OfficesService } from './offices.service';
import {
  CreateOfficeDto,
  OfficeFilterParams,
  UpdateOfficeStatusDto,
} from './dto';
import { Office } from './entities';
import { PaginationParams } from 'src/common/dto';

@Controller('offices')
@UseGuards(RolesGuard)
export class OfficesController {
  constructor(private officesService: OfficesService) {}

  @Roles(Role.ADMIN)
  @Get()
  getOffices(
    @Query() { search }: OfficeFilterParams,
    @Query() { page, size }: PaginationParams,
  ) {
    return this.officesService.findAll({ search, page, size });
  }

  @Roles(Role.ADMIN)
  @Get('/:id')
  getOfficeById(@Param('id') id: string): Promise<Office> {
    return this.officesService.findById(+id);
  }

  @Roles(Role.MODERATOR)
  @Get('/my-offices')
  getMyOffices(@GetUser() user: User): Promise<Office[]> {
    return this.officesService.getMyOffices(user);
  }

  @Get('/my-offices/:id')
  getMyOfficeById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Office> {
    return this.officesService.getMyOfficeById(+id, user);
  }

  @Roles(Role.MODERATOR)
  @Post('/my-offices')
  createOffice(
    @Body() createOfficeDto: CreateOfficeDto,
    @GetUser() user: User,
  ): Promise<Office> {
    return this.officesService.createOne(createOfficeDto, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.officesService.deleteOne(+id);
  }

  @Patch('/my-offices/:id/status')
  updateOfficeStatus(
    @Param('id') id: string,
    @Body() updateOfficeStatusDto: UpdateOfficeStatusDto,
    @GetUser() user: User,
  ): Promise<Office> {
    const { status } = updateOfficeStatusDto;
    return this.officesService.updateMyOfficeStatus(+id, status, user);
  }
}
