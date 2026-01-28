import { IsString } from 'class-validator';

export class RequestRtpCapabilitiesRequestDto {
  @IsString()
  roomId: string;
}
