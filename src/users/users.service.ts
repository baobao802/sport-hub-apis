import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Pagination } from 'src/common/types';
import { Role } from 'src/roles/entities';
import { Role as ERole } from 'src/roles/enum';
import { RolesService } from 'src/roles/roles.service';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto, GetUsersFilterDto, UpdateProfileDto } from './dto';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

  async findUsers(filterDto: GetUsersFilterDto): Promise<Pagination<User>> {
    const { search = '', page = 1, size = 10 } = filterDto;
    const [users, count] = await this.usersRepository.findAndCount({
      where: [
        { firstName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
      ],
      skip: (page - 1) * size,
      take: size,
    });

    const totalItems = count;
    const itemCount = users.length;
    const itemsPerPage = size;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = page;

    return {
      items: users,
      meta: {
        itemCount,
        totalItems,
        itemsPerPage,
        totalPages,
        currentPage,
      },
    };
  }

  async findById(id: string): Promise<User> {
    const found = this.usersRepository.findOne({
      where: {
        id,
      },
      // withDeleted: true,
    });

    if (!found) {
      throw new NotFoundException(`User with ${id} not found.`);
    }

    return found;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async deleteUserById(id: string): Promise<void> {
    const deleteRes = await this.usersRepository.softDelete(id);
    if (!deleteRes.affected) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }

  async restoreUserById(id: string): Promise<void> {
    const restoreRes = await this.usersRepository.restore(id);
    if (!restoreRes.affected) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
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
