import { registerAs } from '@nestjs/config'
import { CONFIGS } from '../constants/configs.constant'

export default registerAs(CONFIGS.ENCRYPTION, () => ({
  key: process.env.ENCRYPTION_KEY || 'default_encryption_key_32_chars!',
  ivLength: parseInt(process.env.ENCRYPTION_IV_LENGTH || '12', 10),
  algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm',
}))
