import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Address } from 'src/place/entities';
import { User } from 'src/user/entities';
import { OfficeStatus } from '../enum';

@Entity()
export class Office {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  picture: string;

  @Column({ length: 120 })
  name: string;

  @Column()
  description: string;

  @Column({ enum: OfficeStatus })
  status: OfficeStatus;

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  address: Address;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((_type) => User, (user) => user.offices, { eager: false })
  @Exclude({ toPlainOnly: true })
  managerStuff: User;
}
