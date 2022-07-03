import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { City } from './city.entity';

@Entity()
export class District {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Address, (address) => address.district)
  address: Address[];

  @ManyToOne(() => City)
  @JoinColumn()
  city: City;
}
