import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/services/user.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ITokenConfig } from '@/config/types/interface/token.interface';
import { CONFIGS } from '@/config/constants/configs.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configServiceInstance: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          return req?.cookies?.bearerToken || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configServiceInstance!.get<ITokenConfig>(CONFIGS.TOKEN)!
        .secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByEmail(payload.email);

    return user;
  }
}
