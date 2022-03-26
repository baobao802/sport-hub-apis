import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateProfileDto } from './dto';
import { User } from './entities';
import { GetUser, Roles } from 'src/common/decorators';
import { Role } from 'src/roles/enum';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findUsers() {
    return this.usersService.findUsers();
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
}
