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
import { Public, Roles } from 'nest-keycloak-connect';
import { KeycloakAuthGuard } from 'src/auth/guards';
import { Role } from 'src/auth/types';
import { GetUser } from 'src/common/decorators';
import { PaginationParams } from 'src/common/dto';
import { AppUser } from 'src/common/types';
import { BookingService } from './booking.service';
import { BookingDto, BookingFilterParams } from './dto';

@Controller('/bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  // @Roles({ roles: [Role.APP_USER] })
  @Public()
  @UseGuards(KeycloakAuthGuard)
  createBooking(@Body() bookingDto: BookingDto, @GetUser() user: AppUser) {
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
  // @Roles({ roles: [Role.APP_USER, Role.APP_ADMIN] })
  @Public()
  @UseGuards(KeycloakAuthGuard)
  getMyBookingHistory(
    @Query() { status, date }: BookingFilterParams,
    @GetUser() user: AppUser,
  ) {
    return this.bookingService.findAll({ status, date }, user);
  }

  @Patch('/:id/cancel')
  // @Roles({ roles: [Role.APP_USER] })
  @Public()
  @UseGuards(KeycloakAuthGuard)
  cancelHistory(@Param('id') bookingId: number, @GetUser() user: AppUser) {
    return this.bookingService.cancelBooking(bookingId, user);
  }
}
