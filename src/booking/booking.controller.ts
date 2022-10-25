import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards';
import { GetUser, Roles } from 'src/common/decorators';
import { PaginationParams } from 'src/common/dto';
import { Role } from 'src/permission/enum';
import { User } from 'src/user/entities';
import { BookingService } from './booking.service';
import { BookingDto, BookingFilterParams } from './dto';

@Controller('/bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  @Roles(Role.CUSTOMER)
  @UseGuards(RolesGuard)
  createBooking(@Body() bookingDto: BookingDto, @GetUser() user: User) {
    return this.bookingService.createOne(bookingDto, user);
  }

  @Get('/history')
  getBookingHistory(
    @Query() { cityId, status, date, pitchId }: BookingFilterParams,
    @Query() { page, size }: PaginationParams,
  ) {
    return this.bookingService.findAll({
      cityId,
      status,
      date,
      pitchId,
      page,
      size,
    });
  }

  @Get('/my-history')
  @Roles(Role.CUSTOMER, Role.LESSOR)
  @UseGuards(RolesGuard)
  getMyBookingHistory(
    @Query() { status, date }: BookingFilterParams,
    @GetUser() user: User,
  ) {
    return this.bookingService.findAll(
      {
        status,
        date,
      },
      user,
    );
  }

  @Patch('/:id/cancel')
  @Roles(Role.CUSTOMER)
  @UseGuards(RolesGuard)
  cancelHistory(@Param('id') bookingId: number, @GetUser() user: User) {
    return this.bookingService.cancelBooking(bookingId, user);
  }
}
