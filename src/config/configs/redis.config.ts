import { registerAs } from '@nestjs/config';
import { CONFIGS } from '../constants/configs.constant';

export default registerAs(CONFIGS.REDIS, () => ({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  port: process.env.REDIS_PORT,
  db: process.env.REDIS_DB,
}));
