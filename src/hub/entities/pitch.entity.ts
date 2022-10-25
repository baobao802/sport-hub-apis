import { Booking } from 'src/booking/entities';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CostType, PitchType } from '../types';
import { Hub } from './hub.entity';

@Entity()
export class Pitch {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column({ type: 'enum', enum: PitchType })
  type: PitchType;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'jsonb' })
  cost: CostType[];

  @ManyToOne(() => Hub, (hub) => hub.pitches)
  hub: Hub;

  @OneToMany(() => Booking, (booking) => booking.pitch)
  bookings: Booking[];
}
