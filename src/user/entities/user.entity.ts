import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from 'src/permission/entities';
import { Exclude } from 'class-transformer';
import { Address } from 'src/place/entities';
import { Hub } from 'src/hub/entities';
import { Club } from 'src/club/entities';
import { Booking } from 'src/booking/entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @Column({ default: false })
  isEnabled: boolean;

  @Column({ default: false })
  isLocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 13, unique: true, nullable: true })
  telephone: string;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable()
  roles: Role[];

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  address: Address;

  @OneToOne(() => Club, { cascade: true })
  @JoinColumn()
  club: Club;

  @OneToOne(() => Hub, { cascade: true })
  @JoinColumn()
  hub: Hub;

  @OneToMany(() => Booking, (booking) => booking.customer)
  bookings: Booking[];
}
