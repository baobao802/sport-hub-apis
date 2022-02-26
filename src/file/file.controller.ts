import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private configServer: ConfigService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): { url: string } {
    const url =
      req.protocol +
      '://' +
      req.get('host') +
      req.originalUrl.replace('upload', file.filename);

    return {
      url,
    };
  }

  @Get('/:filename')
  getFile(@Param('filename') filename, @Res() res: Response): any {
    const filepath = join(
      process.cwd(),
      this.configServer.get<string>('multer.dest'),
      filename,
    );

    return res.sendFile(filepath);
  }

  // @Get('/:filename')
  // getFile(@Param('filename') filename): StreamableFile {
  //   const filepath = join(
  //     process.cwd(),
  //     this.configServer.get<string>('multer.dest'),
  //     filename,
  //   );
  //   const file = createReadStream(filepath);
  //   return new StreamableFile(file);
  // }

  // @Get('/:filename')
  // getFile(
  //   @Param('filename') filename,
  //   @Res({ passthrough: true }) res: Response,
  // ): StreamableFile {
  //   const filepath = join(
  //     process.cwd(),
  //     this.configServer.get<string>('multer.dest'),
  //     filename,
  //   );

  //   const file = createReadStream(filepath);
  //   res.set({
  //     'Content-Type': 'application/octet-stream',
  //     'Content-Disposition': `inline; filename="${filename}"`,
  //   });
  //   return new StreamableFile(file);
  // }
}
