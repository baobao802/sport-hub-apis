import { Exclude, Transform } from 'class-transformer';
import { Pitch } from 'src/hub/entities';
import { User } from 'src/user/entities';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingStatus } from '../types';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  cost: number;

  @Column()
  time: string;

  @Column({ enum: BookingStatus, type: 'enum' })
  status: BookingStatus;

  @Column({ length: 10 })
  date: string;

  @Column()
  @Exclude()
  cityId: number;

  @ManyToOne(() => User, (customer) => customer.bookings)
  customer: User;

  @ManyToOne(() => Pitch, (pitch) => pitch.bookings)
  pitch: Pitch;

  @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
  @CreateDateColumn()
  createdAt: Date;

  @Transform(({ value }) => value?.toISOString(), { toPlainOnly: true })
  @DeleteDateColumn()
  deletedAt: Date;
}
