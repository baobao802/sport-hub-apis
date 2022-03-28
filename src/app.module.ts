import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatModule } from './chat/chat.module';
import httpConfig from './configs/http.config';
import databaseConfig, { typeOrmConfigAsync } from './configs/typeorm.config';
import { EmailModule } from './email/email.module';

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
  ],
})
export class AppModule {}
