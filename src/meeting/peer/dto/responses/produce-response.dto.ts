import { Expose } from 'class-transformer';

export class ProduceResponseDto {
  @Expose()
  id: string;
}
