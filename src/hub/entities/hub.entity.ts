import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Address } from 'src/place/entities';
import { User } from 'src/user/entities';
import { Pitch } from './pitch.entity';

@Entity()
export class Hub {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  picture: string;

  @Column({ length: 120 })
  name: string;

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  address: Address;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => User, (user) => user.hub, { eager: true })
  owner: User;

  @OneToMany(() => Pitch, (pitch) => pitch.hub, {
    eager: true,
    cascade: true,
  })
  pitches: Pitch[];
}
