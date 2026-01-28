import { AppData, MediaKind, RtpParameters } from 'mediasoup/node/lib/types';
import { IsDefined, IsEnum, IsObject } from 'class-validator';

export class ProduceRequestDto {
  @IsDefined()
  @IsEnum(['audio', 'video'], {
    message: 'kind must be either "audio" or "video"',
  })
  kind: MediaKind;

  @IsDefined()
  @IsObject()
  rtpParameters: RtpParameters;

  @IsDefined()
  @IsObject()
  appData: AppData;
}
