import { ETransportType } from '@/meeting/common/enums/transport.enum';
import { IsEnum, IsString } from 'class-validator';

export class CreateTransportRequestDto {
  @IsString()
  roomId: string;

  @IsEnum(ETransportType, { message: 'type must be either send or recv' })
  type: ETransportType;
}
