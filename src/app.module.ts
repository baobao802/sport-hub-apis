import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import databaseConfig, { typeOrmConfigAsync } from './configs/typeorm.config';
import httpConfig from './configs/http.config';
import { keycloakConfigAsync } from './configs/keycloak.config';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './file/files.module';
import { ChatModule } from './chat/chat.module';
import { EmailModule } from './email/email.module';
import { PlaceModule } from './place/place.module';
import { ClubModule } from './club/club.module';
import { HubModule } from './hub/hub.module';
import { BookingModule } from './booking/booking.module';
import { APP_GUARD } from '@nestjs/core';
import { KeycloakAuthGuard } from './auth/guards';
import { SearchModule } from './seach/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      load: [httpConfig, databaseConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    KeycloakConnectModule.registerAsync(keycloakConfigAsync),
    AuthModule,
    AccountModule,
    HubModule,
    ClubModule,
    FilesModule,
    ChatModule,
    ScheduleModule.forRoot(),
    EmailModule,
    PlaceModule,
    BookingModule,
    SearchModule,
  ],
  providers: [
    // { provide: APP_GUARD, useClass: AuthGuard },
    // { provide: APP_GUARD, useClass: ResourceGuard },
    // { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
