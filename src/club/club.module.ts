import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { Club } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Club]), AuthModule],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
