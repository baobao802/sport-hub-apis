import { Body, Controller, Get, Post } from '@nestjs/common';
import { Role } from './entities';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Post()
  createRole(@Body() role: Role): Promise<Role> {
    return this.permissionService.createRole(role);
  }

  @Get()
  getRoles(): Promise<Role[]> {
    return this.permissionService.getRoles();
  }
}
