import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Office } from './entities';
import { OfficesController } from './offices.controller';
import { OfficesService } from './offices.service';

@Module({
  imports: [TypeOrmModule.forFeature([Office]), AuthModule],
  controllers: [OfficesController],
  providers: [OfficesService],
})
export class OfficesModule {}
