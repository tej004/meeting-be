import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from './common/timestamp.abstract.entity';

@Entity('room')
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column(() => TimestampEntity, { prefix: false })
  timestamp: TimestampEntity;
}
