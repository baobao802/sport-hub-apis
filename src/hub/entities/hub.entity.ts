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
import { Pitch } from './pitch.entity';

@Entity()
export class Hub {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  ownerId: string;

  @Column({ length: 120 })
  name: string;

  @Column({ nullable: true })
  picture: string;

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  address: Address;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // @OneToOne(() => User, (user) => user.hub, { eager: true })
  // Id: User;

  @OneToMany(() => Pitch, (pitch) => pitch.hub, {
    eager: true,
    cascade: true,
  })
  pitches: Pitch[];
}
