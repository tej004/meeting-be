import { registerAs } from '@nestjs/config';
import { CONFIGS } from '../constants/configs.constant';

export default registerAs(CONFIGS.TOKEN, () => ({
  secret: process.env.TOKEN_SECRET,
  expiresIn: process.env.TOKEN_EXPIRES_IN,
}));
