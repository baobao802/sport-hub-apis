import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationParams } from 'src/common/dto';
import { Pagination } from 'src/common/interfaces';
import { createPaginationResponse } from 'src/utils';
import { ILike, Repository } from 'typeorm';
import { CreateFileDto, FileFilterParams } from './dto';
import { File } from './entities';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {}

  async save(createFileDto: CreateFileDto): Promise<File> {
    return this.filesRepository.save(createFileDto);
  }

  async findByName(name: string): Promise<File> {
    const found = await this.filesRepository.findOne({
      where: {
        name,
      },
    });

    if (!found) {
      throw new NotFoundException(`File ${name} not found.`);
    }

    return found;
  }

  async findFiles(
    options: FileFilterParams & PaginationParams,
  ): Promise<Pagination<File>> {
    const { search = '', page = 1, size = 10 } = options;
    const [files, count] = await this.filesRepository.findAndCount({
      where: [{ name: ILike(`%${search}%`) }],
      skip: (page - 1) * size,
      take: size,
    });

    return createPaginationResponse(files, count, page, size);
  }
}
