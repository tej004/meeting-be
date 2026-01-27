import { Expose } from 'class-transformer';

export class TimestampResponseDto {
  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
