import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities';
import { Role as ERole } from './enum';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async createRole(role: Role): Promise<Role> {
    return this.rolesRepository.save(role);
  }

  async getRoles(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async getRoleByName(name: ERole): Promise<Role> {
    const found = await this.rolesRepository.findOne({
      where: {
        name,
      },
    });

    if (!found) {
      throw new NotFoundException(`Role "${name}" not found.`);
    }

    return found;
  }
}
