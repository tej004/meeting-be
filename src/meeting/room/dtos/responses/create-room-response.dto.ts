import { TimestampResponseDto } from '@/meeting/common/dtos/responses/timestamp-response.dto';
import { Expose, Type } from 'class-transformer';

export class CreateRoomResponseDto {
  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  ownerId: string;

  @Expose()
  @Type(() => TimestampResponseDto)
  timestamp: TimestampResponseDto;
}
