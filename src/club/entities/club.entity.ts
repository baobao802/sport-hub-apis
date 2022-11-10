import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ClubMember } from '../types';

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

  @Column({ nullable: false })
  managerId: string;
}
