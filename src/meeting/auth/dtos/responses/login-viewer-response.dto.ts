import { Expose, Type } from 'class-transformer';

export class LoginViewerResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  user: any; // dont use BaseUserDto since it is not real user
}
