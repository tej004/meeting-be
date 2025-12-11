import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { BaseUserDto } from '../dtos/base-user.dto';
import { UserEntity } from '@/database/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signin')
  async signIn(@Body() body: BaseUserDto) {
    return this.userService.create(body as Partial<UserEntity>);
  }
}
