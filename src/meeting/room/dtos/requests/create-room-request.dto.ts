import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';

export class CreateRoomRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  autoAcceptRoom: boolean;
}
