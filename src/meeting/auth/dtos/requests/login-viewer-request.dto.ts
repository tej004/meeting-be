import { IsNotEmpty, IsString } from 'class-validator';

export class LoginViewerRequestDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  tempKey: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
