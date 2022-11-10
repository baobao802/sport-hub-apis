import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { AuthModule } from 'src/auth/auth.module';
import { BookingModule } from 'src/booking/booking.module';
import { SearchModule } from 'src/seach/search.module';
import { Hub, Pitch } from './entities';
import { HubController } from './hub.controller';
import { HubService } from './hub.service';
import PitchSearchService from './pitchSearch.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hub, Pitch]),
    AuthModule,
    AccountModule,
    forwardRef(() => BookingModule),
    SearchModule,
  ],
  controllers: [HubController],
  providers: [HubService, PitchSearchService],
  exports: [HubService],
})
export class HubModule {}
