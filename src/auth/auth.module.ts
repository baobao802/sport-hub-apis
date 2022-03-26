import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  GoogleOauthStrategy,
  JwtAuthStrategy,
  JwtRefreshStrategy,
} from './strategies';
import jwtConfig, { jwtConfigAsync } from './configs/jwt.config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtConfigAsync),
    forwardRef(() => UsersModule),
  ],
  providers: [
    AuthService,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    GoogleOauthStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
