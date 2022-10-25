import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import databaseConfig, { typeOrmConfigAsync } from './configs/typeorm.config';
import httpConfig from './configs/http.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';
import { FilesModule } from './file/files.module';
import { ChatModule } from './chat/chat.module';
import { EmailModule } from './email/email.module';
import { PlaceModule } from './place/place.module';
import { ClubModule } from './club/club.module';
import { HubModule } from './hub/hub.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      load: [httpConfig, databaseConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    UsersModule,
    HubModule,
    ClubModule,
    FilesModule,
    ChatModule,
    ScheduleModule.forRoot(),
    EmailModule,
    PlaceModule,
    BookingModule,
  ],
})
export class AppModule {}
