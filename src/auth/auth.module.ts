import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './services';
import { AuthController } from './controllers';
import { RolesRepository, UsersRepository } from './repositories';
import { GoogleOauthStrategy, JwtAuthStrategy } from './strategies';
import jwtConfig, { jwtConfigAsync } from 'src/configs/jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtConfigAsync),
    TypeOrmModule.forFeature([UsersRepository, RolesRepository]),
  ],
  providers: [AuthService, JwtAuthStrategy, GoogleOauthStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
