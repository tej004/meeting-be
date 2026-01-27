import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { BaseUserRequestDto } from '../dtos/requests/base-user-request.dto';
import { JwtAuthGuard } from '@/meeting/auth/guards/jwt.guard';
import { UserEntity } from '@/database/entities/user.entity';
import { USER_ROUTE_NAME, USER_ROUTES } from '../constants/routes/user.routes';
import { AuthenticatedUser } from '@/meeting/auth/decorator/authenticated-user.decorator';

@Controller(USER_ROUTE_NAME)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(USER_ROUTES.SIGN_UP)
  signIn(@Body() body: BaseUserRequestDto) {
    return this.userService.create(body);
  }

  @Get(USER_ROUTES.PROFILE)
  @UseGuards(JwtAuthGuard)
  getProfile(
    @AuthenticatedUser() user: UserEntity,
  ): Promise<BaseUserRequestDto | null> {
    return this.userService.findByEmail(user.email);
  }

  
}
