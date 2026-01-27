import { UserService } from '@/meeting/user/services/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { EncryptionService } from '../services/encryption.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
  ) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email.');
    }
    const decryptedPassword = this.encryptionService.decrypt(user.password);

    if (decryptedPassword !== password) {
      throw new UnauthorizedException('Invalid password.');
    }

    return user;
  }
}
