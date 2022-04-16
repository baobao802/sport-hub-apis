import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/common/types';
import { ILike, Repository } from 'typeorm';
import { CreateFileDto } from './dto';
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

  async findFiles(filterDto): Promise<Pagination<File>> {
    const { search = '', page = 1, size = 10 } = filterDto;
    const [files, count] = await this.filesRepository.findAndCount({
      where: [{ name: ILike(`%${search}%`) }],
      skip: (page - 1) * size,
      take: size,
    });

    const totalItems = count;
    const itemCount = files.length;
    const itemsPerPage = size;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = page;

    return {
      items: files,
      meta: {
        itemCount,
        totalItems,
        itemsPerPage,
        totalPages,
        currentPage,
      },
    };
  }
}
