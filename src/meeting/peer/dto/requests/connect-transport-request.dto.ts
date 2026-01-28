import { ETransportType } from '@/meeting/common/enums/transport.enum';
import { DtlsParameters } from 'mediasoup/node/lib/WebRtcTransportTypes';
import { IsEnum, IsObject, IsString, ValidateNested } from 'class-validator';

export class ConnectTransportRequestDto {
  @IsObject()
  dtlsParameters: DtlsParameters;

  @IsEnum(ETransportType, {
    message: 'transportType must be a valid ETransportType',
  })
  transportType: ETransportType;
}
