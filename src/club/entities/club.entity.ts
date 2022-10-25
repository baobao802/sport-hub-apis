import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClubMember } from '../types';
import { User } from 'src/user/entities';

@Entity()
export class Club {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 24, unique: true })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ length: 256, nullable: true })
  bio: string;

  @Column({ type: 'jsonb' })
  members: ClubMember[];

  @OneToOne(() => User, (user) => user.club, { eager: true })
  manager: User;
}
