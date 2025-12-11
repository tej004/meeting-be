import { ERole } from '@/database/types/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsStrongPassword,
  IsEnum,
  IsOptional,
  Length,
} from 'class-validator';

export class BaseUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 150)
  email: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  username: string;

  @ApiProperty({ example: 'StrongP@ssw0rd!' })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    enum: ERole,
    example: ERole.USER,
  })
  @IsEnum(ERole)
  @IsOptional()
  role: ERole;
}
