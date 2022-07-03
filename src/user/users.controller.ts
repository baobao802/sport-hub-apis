import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateProfileDto, UserFilterParams } from './dto';
import { User } from './entities';
import { GetUser, Roles } from 'src/common/decorators';
import { Role } from 'src/permission/enum';
import { RolesGuard } from 'src/auth/guards';
import { PaginationParams } from 'src/common/dto';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createOne(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  getUsers(
    @Query() { search }: UserFilterParams,
    @Query() { page, size }: PaginationParams,
  ) {
    return this.usersService.findAll({ search, page, size });
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }

  // @Patch(':id')
  // updatePassword(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
  //   return this.usersService.updatePassword(+id, updatePasswordDto);
  // }

  @Patch('user/profile')
  updateProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user, updateProfileDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  restoreUser(@Param('id') id: string) {
    return this.usersService.restoreUserById(id);
  }
}
