import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from 'src/tasks/entities';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
