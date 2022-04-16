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
import { CreateUserDto, UpdateProfileDto } from './dto';
import { User } from './entities';
import { GetUser, Roles } from 'src/common/decorators';
import { Role } from 'src/roles/enum';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { Pagination } from 'src/common/types';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  getUsers(@Query() filterDto: GetUsersFilterDto): Promise<Pagination<User>> {
    return this.usersService.findUsers(filterDto);
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
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }

  @Patch(':id')
  restoreUser(@Param('id') id: string) {
    return this.usersService.restoreUserById(id);
  }
}
