import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BookingModule } from 'src/booking/booking.module';
import { Hub, Pitch } from './entities';
import { HubController } from './hub.controller';
import { HubsService } from './hub.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hub, Pitch]),
    AuthModule,
    forwardRef(() => BookingModule),
  ],
  controllers: [HubController],
  providers: [HubsService],
  exports: [HubsService],
})
export class HubModule {}
