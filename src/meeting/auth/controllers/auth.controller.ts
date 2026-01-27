import { Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserEntity } from '@/database/entities/user.entity';
import { LocalAuthGuard } from '../guards/local.guard';
import { AUTH_ROUTE_NAME, AUTH_ROUTES } from '../constants/routes/auth.routes';
import { AuthenticatedUser } from '../decorator/authenticated-user.decorator';
import { StandardApiResponse } from '@/config/common/response';
import { LoginResponseDto } from '../dtos/responses/login-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller(AUTH_ROUTE_NAME)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AUTH_ROUTES.LOGIN)
  @UseGuards(LocalAuthGuard)
  async login(
    @AuthenticatedUser() user: UserEntity,
  ): Promise<StandardApiResponse<LoginResponseDto>> {
    const loginResult = await this.authService.login(user);

    return new StandardApiResponse(
      'Login successful',
      plainToInstance(LoginResponseDto, loginResult, {
        excludeExtraneousValues: true,
      }),
      HttpStatus.CREATED,
    );
  }
}
