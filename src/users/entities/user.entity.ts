import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from 'src/tasks/entities';
import { Role } from 'src/roles/entities';
import { Address } from './address.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @Column({ default: false })
  isEnabled: boolean;

  @Column({ default: false })
  isLooked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable()
  roles: Role[];

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  address: Address;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
