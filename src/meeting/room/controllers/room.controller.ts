import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from '../services/room.service';
import { JwtAuthGuard } from '@/meeting/auth/guards/jwt.guard';
import { ROOM_ROUTE_NAME, ROOM_ROUTES } from '../constants/routes/room.routes';
import { UserEntity } from '@/database/entities/user.entity';
import { AuthenticatedUser } from '@/meeting/auth/decorator/authenticated-user.decorator';
import { CreateRoomRequestDto } from '../dtos/requests/create-room-request.dto';
import { StandardApiResponse } from '@/config/common/response';
import { plainToInstance } from 'class-transformer';
import { CreateRoomResponseDto } from '../dtos/responses/create-room-response.dto';
import { GetAllRoomsRequestDto } from '../dtos/requests/get-all-rooms-request.dto';

@Controller(ROOM_ROUTE_NAME)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post(ROOM_ROUTES.CREATE_ROOM)
  @UseGuards(JwtAuthGuard)
  async createRoom(
    @Body() body: CreateRoomRequestDto,
    @AuthenticatedUser() user: UserEntity
  ): Promise<StandardApiResponse<CreateRoomResponseDto>> {
    return new StandardApiResponse(
      'Room created successfully',
      plainToInstance(
        CreateRoomResponseDto,
        await this.roomService.createRoom(body, user.uuid),
        {
          excludeExtraneousValues: true,
        }
      ),
      HttpStatus.CREATED
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllRooms(
    @AuthenticatedUser() user: UserEntity,
    @Query() query: GetAllRoomsRequestDto
  ): Promise<any> {
    const isActiveMap = {
      true: this.roomService.findActiveRooms.bind(this.roomService),
      false: this.roomService.findAllRoomsByOwnerId.bind(this.roomService),
    };

    const rooms = await isActiveMap[String(query.isActive)](user.uuid);

    return new StandardApiResponse(
      'Rooms fetched successfully',
      plainToInstance(CreateRoomResponseDto, rooms),
      HttpStatus.OK
    );
  }

  @Post(ROOM_ROUTES.CREATE_ROOM_TOKEN)
  @UseGuards(JwtAuthGuard)
  async createRoomToken(
    @Body('roomId') roomId: string,
    @AuthenticatedUser() user: UserEntity
  ): Promise<StandardApiResponse<{ tempKey: string }>> {
    const result = await this.roomService.createRoomToken(roomId, user.uuid);
    return new StandardApiResponse(
      'Temporary key generated',
      result,
      HttpStatus.CREATED
    );
  }
}
