import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { KeycloakAuthStrategy } from './strategies';
import keycloakConfig from 'src/configs/keycloak.config';

@Module({
  imports: [ConfigModule.forFeature(keycloakConfig), HttpModule],
  providers: [AuthService, KeycloakAuthStrategy],
  controllers: [AuthController],
  exports: [AuthService, KeycloakAuthStrategy],
})
export class AuthModule {}
