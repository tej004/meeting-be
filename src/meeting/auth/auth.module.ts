import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { EncryptionService } from './services/encryption.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CONFIGS } from '@/config/constants/configs.constant';
import { ITokenConfig } from '@/config/types/interface/token.interface';
import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { WsJwtGuard } from './guards/ws.jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configServiceInstance: ConfigService) => {
        const config = configServiceInstance.get<ITokenConfig>(CONFIGS.TOKEN);

        if (
          config == null ||
          config?.secret == null ||
          config?.expiresIn == null
        ) {
          throw new Error('Token configuration is missing');
        }

        return {
          secret: config!.secret,
          signOptions: {
            expiresIn: config!.expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    EncryptionService,
    AuthService,
    JwtAuthGuard,
    LocalAuthGuard,
    WsJwtGuard,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [JwtModule, EncryptionService, AuthService, WsJwtGuard],
})
export class AuthModule {}
