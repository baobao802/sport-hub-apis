import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFileDto } from './dto';
import { File } from './entities';
import { FilesRepository } from './repositories';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesRepository)
    private filesRepository: FilesRepository,
  ) {}

  async save(createFileDto: CreateFileDto): Promise<File> {
    return this.filesRepository.save(createFileDto);
  }

  async findByName(name: string): Promise<File> {
    const found = await this.filesRepository.findOne({ name });

    if (!found) {
      throw new NotFoundException(`File ${name} not found.`);
    }

    return found;
  }
}
