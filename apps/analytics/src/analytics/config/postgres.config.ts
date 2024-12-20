import { registerAs } from '@nestjs/config';

// Postgres 데이터베이스 설정을 위한 환경 변수
export default registerAs('postgres', () => ({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5434,
  database: process.env.POSTGRES_DATABASE || 'analytics-service',
  username: process.env.POSTGRES_USERNAME || 'analytics-service',
  password: process.env.POSTGRES_PASSWORD || 'analytics-service',
}));
