import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/user/users.module';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { Club } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Club]), AuthModule, UsersModule],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
