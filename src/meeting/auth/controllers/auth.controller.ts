import { BaseUserDto } from '@/meeting/user/dtos/base-user.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('signin')
  async signIn(@Body() body: BaseUserDto) {
    // Implement sign-in logic //#endregion
  }
}
