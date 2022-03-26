import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repositories';
import { RolesModule } from 'src/roles/roles.module';
import { Address } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository, Address]),
    forwardRef(() => AuthModule),
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
