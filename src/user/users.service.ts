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
    const { password, roles } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const rolesAssign: Role[] = [];
    if (!roles) {
      const roleUser = await this.permissionService.getRoleByName(
        ERole.CUSTOMER,
      );
      rolesAssign.push(roleUser);
    } else {
      if (roles.includes(ERole.ADMIN)) {
        const roleAdmin = await this.permissionService.getRoleByName(
          ERole.ADMIN,
        );
        rolesAssign.push(roleAdmin);
      }

      if (roles.includes(ERole.LESSOR)) {
        const roleModerator = await this.permissionService.getRoleByName(
          ERole.LESSOR,
        );
        rolesAssign.push(roleModerator);
      }

      if (roles.includes(ERole.CUSTOMER)) {
        const roleUser = await this.permissionService.getRoleByName(
          ERole.CUSTOMER,
        );
        rolesAssign.push(roleUser);
      }
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      roles: rolesAssign,
    });

    return this.usersRepository.save(user);
  }

  async findAll(
    options: UserFilterParams & PaginationParams,
  ): Promise<Pagination<User>> {
    const { search = '', role, page = 1, size = 10 } = options;
    const [users, count] = await this.usersRepository.findAndCount({
      order: { lastName: 'ASC' },
      relations: {
        roles: true,
      },
      where: [
        { firstName: ILike(`%${search}%`), roles: { name: role } },
        { lastName: ILike(`%${search}%`), roles: { name: role } },
        { email: ILike(`%${search}%`), roles: { name: role } },
        { telephone: ILike(`%${search}%`), roles: { name: role } },
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
    // return this.usersRepository.findOne({
    //   where: { email },
    //   relations: {
    //     club: true,
    //     hub: true,
    //   },
    // });
  }

  async lockUser(id: string) {
    const updateRes = await this.usersRepository.update(id, { isLocked: true });
    if (!updateRes.affected) {
      throw new NotFoundException('Can not lock user');
    }
  }

  async unlockUser(id: string) {
    const updateRes = await this.usersRepository.update(id, {
      isLocked: false,
    });
    if (!updateRes.affected) {
      throw new NotFoundException('Can not unlock user');
    }
  }

  async deleteUserById(id: string) {
    const deleteRes = await this.usersRepository.softDelete(id);
    if (!deleteRes.affected) {
      throw new NotFoundException('Can not delete user');
    }
  }

  async restoreUserById(id: string) {
    const restoreRes = await this.usersRepository.restore(id);
    if (!restoreRes.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async updateProfile(user: User, updateUserDto: UpdateProfileDto) {
    const foundUser = await this.findOne({ id: user.id });
    return this.usersRepository.save({
      ...foundUser,
      ...updateUserDto,
    });
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
