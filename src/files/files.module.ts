import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import multerConfig, { multerConfigAsync } from './configs/multer.config';
import { File } from './entities';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forFeature(multerConfig),
    TypeOrmModule.forFeature([File]),
    MulterModule.registerAsync(multerConfigAsync),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
