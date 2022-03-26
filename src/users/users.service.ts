import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/entities';
import { Role as ERole } from 'src/roles/enum';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities';
import { UsersRepository } from './repositories';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, roles, firstName, lastName } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const rolesAssign: Role[] = [];
    if (!roles) {
      const roleUser = await this.rolesService.getRoleByName(ERole.USER);
      rolesAssign.push(roleUser);
    } else {
      if (roles.includes(ERole.ADMIN)) {
        const roleAdmin = await this.rolesService.getRoleByName(ERole.ADMIN);
        rolesAssign.push(roleAdmin);
      }

      if (roles.includes(ERole.MODERATOR)) {
        const roleModerator = await this.rolesService.getRoleByName(
          ERole.MODERATOR,
        );
        rolesAssign.push(roleModerator);
      }

      if (roles.includes(ERole.USER)) {
        const roleUser = await this.rolesService.getRoleByName(ERole.USER);
        rolesAssign.push(roleUser);
      }
    }

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      roles: rolesAssign,
      firstName,
      lastName,
    });

    return this.usersRepository.save(user);
  }

  async findUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const found = this.usersRepository.findOne({ id });

    if (!found) {
      throw new NotFoundException(`User with ${id} not found.`);
    }

    return found;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async updateProfile(
    user: User,
    updateUserDto: UpdateProfileDto,
  ): Promise<void> {
    const found = await this.findByEmail(user.email);

    if (!found) {
      throw new NotFoundException(`Email ${user.email} not found.`);
    }

    this.usersRepository.save(updateUserDto);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: string) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
