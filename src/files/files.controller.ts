import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { File } from './entities';
import { FilesService } from './files.service';
import { createReadStream } from 'fs';
import { GetFilesFilterDto } from './dto';
import { Pagination } from 'src/common/types';

@Controller('files')
export class FilesController {
  constructor(
    private configServer: ConfigService,
    private filesService: FilesService,
  ) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<File> {
    const url =
      req.protocol +
      '://' +
      req.get('host') +
      req.originalUrl.replace('upload', file.filename);

    return this.filesService.save({
      name: file.filename,
      url,
      mimetype: file.mimetype,
    });
  }

  @Get('/:filename')
  async getFile(
    @Param('filename') filename,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.filesService.findByName(filename);

    const filepath = join(
      process.cwd(),
      this.configServer.get<string>('multer.dest'),
      file.name,
    );

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `inline; filename="${file.name}"`,
    });
    const stream = createReadStream(filepath);

    return new StreamableFile(stream);
  }

  getFiles(@Query() filterDto: GetFilesFilterDto): Promise<Pagination<File>> {
    return this.filesService.findFiles(filterDto);
  }
}
