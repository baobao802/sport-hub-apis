import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import * as fs from 'fs';
import { AppModule } from './app.module';
import {
  TransformInterceptor,
  ExcludeNullInterceptor,
} from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [
        'http://localhost:3000',
        'https://sport-hub-admin.vercel.app',
        'https://sport-hub.vercel.app',
      ],
      credentials: true,
    },
    httpsOptions: {
      key: fs.readFileSync('certs/private-key.pem'),
      cert: fs.readFileSync('certs/cert.pem'),
    },
  });
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get('http.globalPrefix'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // disableErrorMessages: true, disable this one in production environment
    }),
  );
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
