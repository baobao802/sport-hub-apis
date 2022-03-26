import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities';
import { Role as ERole } from './enum';
import { RolesRepository } from './repositories';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesRepository) private rolesRepository: RolesRepository,
  ) {}

  async createRole(role: Role): Promise<Role> {
    return this.rolesRepository.save(role);
  }

  async getRoles(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async getRoleByName(name: ERole): Promise<Role> {
    const found = await this.rolesRepository.findOne({ name });

    if (!found) {
      throw new NotFoundException(`Role "${name}" not found.`);
    }

    return found;
  }
}
