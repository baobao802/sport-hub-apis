import { Hub } from 'src/hub/entities';
import { User } from 'src/user/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { District } from './district.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  street: string;

  @ManyToOne(() => District, (district) => district.address, { eager: true })
  @JoinColumn()
  district: District;

  // @Column({ nullable: true })
  // lat: number;

  // @Column({ nullable: true })
  // lng: number;

  @OneToOne(() => User, (user) => user.address)
  user: User;

  @OneToOne(() => Hub, (hub) => hub.address)
  hub: Hub;
}
