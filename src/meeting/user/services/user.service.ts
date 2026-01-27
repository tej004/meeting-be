import { UserEntity } from '@/database/entities/user.entity';
import { ERole } from '@/database/types/enums/role.enum';
import { EncryptionService } from '@/meeting/auth/services/encryption.service';
import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUserRequestDto } from '../dtos/requests/base-user-request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => EncryptionService))
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(data: BaseUserRequestDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });

    if (existingUser) throw new ConflictException('Email already exist.');

    if (!!data?.password) {
      data.password = this.encryptionService.encrypt(data.password);
    }

    const newUser = this.userRepository.create(data);
    newUser.role = ERole.ADMIN;

    return await this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
