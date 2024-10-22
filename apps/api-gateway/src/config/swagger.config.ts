import { registerAs } from '@nestjs/config';

export default registerAs('swagger', async () => {
  return {
    user: process.env.SWAGGER_USER || 'swagger_user',
    password: process.env.SWAGGER_PASSWORD || 'swagger_password',
  };
});
