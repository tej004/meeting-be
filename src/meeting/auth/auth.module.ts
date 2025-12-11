import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { EncryptionService } from './services/encryption.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [AuthController],
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class AuthModule {}
