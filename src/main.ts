import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';
import {
  TransformInterceptor,
  ExcludeNullInterceptor,
} from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get('http.globalPrefix'));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ExcludeNullInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'static'));
  await app.listen(configService.get('http.port'));
  console.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
