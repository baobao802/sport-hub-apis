import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from '../dto';
import { Role } from '../entities';
import { Role as ERole } from '../enum';
import { JwtPayload, LoginResponse } from '../interfaces';
import { RolesRepository, UsersRepository } from '../repositories';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    @InjectRepository(RolesRepository)
    private rolesRepository: RolesRepository,
    private jwtService: JwtService,
  ) {}

  async signup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password, roles } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const rolesAssign: Role[] = [];
    if (!roles) {
      const roleUser = await this.rolesRepository.findOne({ name: ERole.USER });
      rolesAssign.push(roleUser);
    } else {
      if (roles.includes(ERole.ADMIN)) {
        const roleAdmin = await this.rolesRepository.findOne({
          name: ERole.ADMIN,
        });
        rolesAssign.push(roleAdmin);
      }

      if (roles.includes(ERole.MODERATOR)) {
        const roleModerator = await this.rolesRepository.findOne({
          name: ERole.MODERATOR,
        });
        rolesAssign.push(roleModerator);
      }

      if (roles.includes(ERole.USER)) {
        const roleUser = await this.rolesRepository.findOne({
          name: ERole.USER,
        });
        rolesAssign.push(roleUser);
      }
    }

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      roles: rolesAssign,
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<LoginResponse> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username: user.username, sub: user.id };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken, username };
    } else {
      throw new UnauthorizedException('Please check your login credentials!');
    }
  }

  async loginWithGoogle(user): Promise<LoginResponse> {
    const payload: JwtPayload = { username: user.username, sub: user.id };
    const accessToken: string = await this.jwtService.sign(payload);
    return { accessToken, username: user.username };
  }

  async createRole(role: Role): Promise<Role> {
    return this.rolesRepository.save(role);
  }

  async getRoles(): Promise<Role[]> {
    return this.rolesRepository.find();
  }
}
