import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import httpConfig from './configs/http.config';
import databaseConfig, { typeOrmConfigAsync } from './configs/typeorm.config';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      load: [httpConfig, databaseConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ScheduleModule.forRoot(),
    AuthModule,
    TasksModule,
    FileModule,
    ChatModule,
  ],
})
export class AppModule {}
