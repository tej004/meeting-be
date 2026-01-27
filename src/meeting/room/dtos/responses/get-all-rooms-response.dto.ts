import { TimestampResponseDto } from '@/meeting/common/dtos/responses/timestamp-response.dto';
import { Expose, Type } from 'class-transformer';

export class GetAllRoomsResponseDto {
  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => TimestampResponseDto)
  timestamp: TimestampResponseDto;
}
