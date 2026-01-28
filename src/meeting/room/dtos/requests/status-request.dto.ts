import { IsUUID } from 'class-validator';

export class StatusRequestDto {
  @IsUUID()
  uuid: string;
}
