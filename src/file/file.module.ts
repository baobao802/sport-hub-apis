import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/auth.module';
import multerConfig, { multerConfigAsync } from 'src/configs/multer.config';
import { FileController } from './file.controller';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forFeature(multerConfig),
    MulterModule.registerAsync(multerConfigAsync),
  ],
  controllers: [FileController],
  providers: [],
})
export class FileModule {}
