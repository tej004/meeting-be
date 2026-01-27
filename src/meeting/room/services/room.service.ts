import { WorkerService } from '@/meeting/worker/services/worker.service';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import RoomState from '../state/room.state';
import { Repository } from 'typeorm';
import { RoomEntity } from '@/database/entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomRequestDto } from '../dtos/requests/create-room-request.dto';
import { ROOM_STATE_EVENTS } from '../constants/state/room-event.state';
import { generateRandomKey } from '../helper/generate-random-key.helper';
import { REDIS_CLIENT } from '@/redis/constants/redis-client.constant';
import Redis from 'ioredis';
import { ROOM_TEMP_KEY } from '../constants/cache/room-temp-key.constant';

@Injectable()
export class RoomService {
  public rooms: Map<string, RoomState>;

  constructor(
    private readonly workerService: WorkerService,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis
  ) {
    this.rooms = new Map();
  }
  public isOpen(id: string): boolean {
    return this.rooms.has(id);
  }

  public closeRoom(id: string): void {
    const room: RoomState | undefined = this.rooms.get(id);

    if (!room) {
      throw new Error('Room not found.');
    }

    room.destroy();
  }

  public async createRoom(
    createRoomDto: CreateRoomRequestDto,
    userId: string
  ): Promise<RoomEntity> {
    const creationInstance = this.roomRepository.create({
      name: createRoomDto.name,
      ownerId: userId,
    });
    const roomInstance = await this.roomRepository.save(creationInstance);
    const router = await this.workerService.createRouter();
    const room = new RoomState(
      roomInstance.uuid,
      createRoomDto.name,
      router,
      createRoomDto.autoAcceptRoom
    );

    this.rooms.set(roomInstance.uuid, room);
    room.on(ROOM_STATE_EVENTS.DESTROY, () => {
      this.rooms.delete(roomInstance.uuid);
    });

    return roomInstance;
  }

  public findAllRoomsByOwnerId(ownerId: string): Promise<RoomEntity[] | []> {
    if (!ownerId) throw new NotFoundException('Owner ID is required.');
    return this.roomRepository.find({
      where: { ownerId: ownerId },
    });
  }

  public async findActiveRooms(ownerId: string): Promise<RoomEntity[]> {
    const dbRecordRooms = await this.findAllRoomsByOwnerId(ownerId);

    return dbRecordRooms.filter((currentRoom: RoomEntity) =>
      this.isOpen(currentRoom.uuid)
    );
  }

  public async createRoomToken(
    roomId: string,
    userId: string
  ): Promise<{ tempKey: string }> {
    const room = await this.roomRepository.findOne({
      where: { uuid: roomId, ownerId: userId },
    });

    if (!room || !this.isOpen(room.uuid)) {
      throw new BadRequestException('Room is not active or does not exist');
    }

    const tempKey = generateRandomKey();
    const redisKey = ROOM_TEMP_KEY(room.uuid, tempKey);

    await this.redisClient.set(redisKey, userId, 'EX', 300);

    return { tempKey };
  }
}
