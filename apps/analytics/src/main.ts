import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

// Kafka를 활용한 비동기 방식의 마이크로서비스 설정
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA, // Kafka transporter를 사용하여 비동기 통신 구현
      options: {
        client: {
          brokers: ['host.docker.internal:9092'],
        },
      },
    },
  );
  app.listen();
  console.info(`analytics-service listening`);
}

bootstrap();
