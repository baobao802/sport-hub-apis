import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './task/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';
import { FilesModule } from './file/files.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatModule } from './chat/chat.module';
import httpConfig from './configs/http.config';
import databaseConfig, { typeOrmConfigAsync } from './configs/typeorm.config';
import { EmailModule } from './email/email.module';
import { OfficesModule } from './office/offices.module';
import { PlaceModule } from './place/place.module';

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
    TasksModule,
    FilesModule,
    ChatModule,
    ScheduleModule.forRoot(),
    EmailModule,
    OfficesModule,
    PlaceModule,
  ],
})
export class AppModule {}
