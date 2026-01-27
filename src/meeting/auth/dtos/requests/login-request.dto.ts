import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 150)
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd!' })
  @IsNotEmpty()
  @Length(8, 128)
  password: string;
}
