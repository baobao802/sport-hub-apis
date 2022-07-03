import { registerAs } from '@nestjs/config';

export default registerAs('http', () => ({
  port: parseInt(process.env.PORT, 10),
  timeout: parseInt(process.env.TIMEOUT, 10),
  globalPrefix: process.env.GLOBAL_PREFIX,
}));
