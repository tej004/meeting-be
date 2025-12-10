import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from './common/timestamp.abstract.entity';
import { UserEntity } from './user.entity';

@Entity('room')
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.rooms, { nullable: false })
  owner: UserEntity;

  @Column(() => TimestampEntity, { prefix: false })
  timestamp: TimestampEntity;
}
