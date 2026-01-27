import { TimestampResponseDto } from '@/meeting/common/dtos/responses/timestamp-response.dto';
import { Expose, Type } from 'class-transformer';

export class BaseUserResponseDto {
  @Expose()
  uuid: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  username: string;

  @Expose()
  role: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => TimestampResponseDto)
  timestamp: TimestampResponseDto;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
