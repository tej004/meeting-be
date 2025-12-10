import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ERole } from '../types/enums/role.enum';
import { TimestampEntity } from './common/timestamp.abstract.entity';

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

  @Column(() => TimestampEntity, { prefix: false })
  timestamp: TimestampEntity;
}
