import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { PaginationParams } from 'src/common/dto';
import { Pagination } from 'src/common/interfaces';
import { Role } from 'src/permission/entities';
import { Role as ERole } from 'src/permission/enum';
import { PermissionService } from 'src/permission/permission.service';
import { createPaginationResponse } from 'src/utils';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto, UpdateProfileDto, UserFilterParams } from './dto';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private permissionService: PermissionService,
  ) {}

  async createOne(createUserDto: CreateUserDto) {
    const { email, password, roles, firstName, lastName, phoneNumber } =
      createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const rolesAssign: Role[] = [];
    if (!roles) {
      const roleUser = await this.permissionService.getRoleByName(ERole.USER);
      rolesAssign.push(roleUser);
    } else {
      if (roles.includes(ERole.ADMIN)) {
        const roleAdmin = await this.permissionService.getRoleByName(
          ERole.ADMIN,
        );
        rolesAssign.push(roleAdmin);
      }

      if (roles.includes(ERole.MODERATOR)) {
        const roleModerator = await this.permissionService.getRoleByName(
          ERole.MODERATOR,
        );
        rolesAssign.push(roleModerator);
      }

      if (roles.includes(ERole.USER)) {
        const roleUser = await this.permissionService.getRoleByName(ERole.USER);
        rolesAssign.push(roleUser);
      }
    }

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      roles: rolesAssign,
      firstName,
      lastName,
      phoneNumber,
    });

    return this.usersRepository.save(user);
  }

  async findAll(
    options: UserFilterParams & PaginationParams,
  ): Promise<Pagination<User>> {
    const { search = '', page = 1, size = 10 } = options;
    const [users, count] = await this.usersRepository.findAndCount({
      order: { lastName: 'ASC' },
      where: [
        { firstName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
        { phoneNumber: ILike(`%${search}%`) },
      ],
      skip: (page - 1) * size,
      take: size,
    });

    return createPaginationResponse(users, count, page, size);
  }

  async findOne(options: { id?: string; email?: string }) {
    let found;

    if (options.id) {
      found = await this.usersRepository.findOne({
        where: {
          id: options.id,
        },
      });
    }

    if (options.email) {
      found = await this.usersRepository.findOne({
        where: {
          email: options.email,
        },
      });
    }

    if (!found) {
      throw new NotFoundException('User not found');
    }

    return found;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async deleteUserById(id: string) {
    const deleteRes = await this.usersRepository.softDelete(id);
    if (!deleteRes.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async restoreUserById(id: string) {
    const restoreRes = await this.usersRepository.restore(id);
    if (!restoreRes.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async updateProfile(user: User, updateUserDto: UpdateProfileDto) {
    await this.findOne({ id: user.id });
    return this.usersRepository.update(user.id, updateUserDto);
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
