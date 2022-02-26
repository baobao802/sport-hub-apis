import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role as ERole } from '../enum';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ERole,
    unique: true,
  })
  name: ERole;
}
