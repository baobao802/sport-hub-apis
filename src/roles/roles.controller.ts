import { Body, Controller, Get, Post } from '@nestjs/common';
import { Role } from './entities';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  createRole(@Body() role: Role): Promise<Role> {
    return this.rolesService.createRole(role);
  }

  @Get()
  getRoles(): Promise<Role[]> {
    return this.rolesService.getRoles();
  }
}
