import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { Address, City, District } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Address, City, District]), AuthModule],
  controllers: [PlaceController],
  providers: [PlaceService],
  exports: [PlaceService],
})
export class PlaceModule {}
