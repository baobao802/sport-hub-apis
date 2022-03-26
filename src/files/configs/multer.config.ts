import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import {
  MulterModuleAsyncOptions,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { extname } from 'path';

export default registerAs('multer', () => ({
  dest: process.env.MULTER_DEST || './uploads',
}));

export const multerConfigAsync: MulterModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<MulterModuleOptions> => ({
    dest: configService.get<string>('multer.dest'),
    // storage: diskStorage({
    //   destination: configService.get<string>('multer.dest'),
    //   filename: (req, file, callback) => {
    //     const name = file.originalname.split('.')[0];
    //     const fileExtName = extname(file.originalname);
    //     const randomName = Array(4)
    //       .fill(null)
    //       .map(() => Math.round(Math.random() * 16).toString(16))
    //       .join('');
    //     callback(null, `${name}-${randomName}${fileExtName}`);
    //   },
    // }),
    fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        // Allow storage of file
        cb(null, true);
      } else {
        // Reject file
        cb(
          new HttpException(
            `Unsupported file type ${extname(file.originalname)}`,
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }
    },
  }),
  inject: [ConfigService],
};
