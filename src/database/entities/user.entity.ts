import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ERole } from '../types/enums/role.enum';
import { TimestampEntity } from './common/timestamp.abstract.entity';
import { RoomEntity } from './room.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 150 })
  firstName: string;

  @Column({ type: 'varchar', length: 150 })
  lastName: string;

  @Column({ type: 'varchar', length: 150 })
  username: string;

  @Column({ type: 'enum', enum: ERole, default: ERole.USER })
  role: ERole = ERole.USER;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => RoomEntity, (room) => room.owner)
  rooms: RoomEntity[];

  @Column(() => TimestampEntity, { prefix: false })
  timestamp: TimestampEntity;
}
