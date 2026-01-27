import {
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Request,
  Body,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../services/auth.service';
import { UserEntity } from '@/database/entities/user.entity';
import { LocalAuthGuard } from '../guards/local.guard';
import { AUTH_ROUTE_NAME, AUTH_ROUTES } from '../constants/routes/auth.routes';
import { AuthenticatedUser } from '../decorator/authenticated-user.decorator';
import { StandardApiResponse } from '@/config/common/response';
import { LoginResponseDto } from '../dtos/responses/login-response.dto';
import { plainToInstance } from 'class-transformer';
import { ViewerLocalGuard } from '../guards/viewer-local.guard';
import { LoginViewerRequestDto } from '../dtos/requests/login-viewer-request.dto';
import { LoginViewerResponseDto } from '../dtos/responses/login-viewer-response.dto';

@Controller(AUTH_ROUTE_NAME)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AUTH_ROUTES.LOGIN)
  @UseGuards(LocalAuthGuard)
  async login(
    @AuthenticatedUser() user: UserEntity
  ): Promise<StandardApiResponse<LoginResponseDto>> {
    const loginResult = await this.authService.login(user);

    return new StandardApiResponse(
      'Login successful',
      plainToInstance(LoginResponseDto, loginResult, {
        excludeExtraneousValues: true,
      }),
      HttpStatus.CREATED
    );
  }

  @Post(AUTH_ROUTES.LOGIN_VIEWER)
  @UseGuards(ViewerLocalGuard)
  async loginViewer(
    @Body() body: LoginViewerRequestDto
  ): Promise<StandardApiResponse<LoginViewerResponseDto>> {
    const name = body.name;
    const roomId = body.roomId;
    const result = await this.authService.loginViewer(name, roomId);

    return new StandardApiResponse(
      'Login as a viewer successful',
      {
        accessToken: result.accessToken,
        user: result.user,
      },
      HttpStatus.CREATED
    );
  }
}
