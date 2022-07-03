import { Office } from 'src/office/entities';
import { User } from 'src/user/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { District } from './district.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  address: string;

  @Column()
  street: string;

  @OneToOne(() => District, { eager: true })
  @JoinColumn()
  district: District;

  @Column({ nullable: true })
  lat: number;

  @Column({ nullable: true })
  lng: number;

  @OneToOne(() => User, (user) => user.address)
  user: User;

  @OneToOne(() => Office, (office) => office.address)
  office: Office;
}
