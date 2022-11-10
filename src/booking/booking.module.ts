import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { HubModule } from 'src/hub/hub.module';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    AuthModule,
    forwardRef(() => HubModule),
    EmailModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
