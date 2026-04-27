import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`${process.env.RABBIT_MQ_URL}`],
      queue: 'user_queue',
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:8080', 'https://peerly-user-management-cdduhkfehcb8aag2.canadacentral-01.azurewebsites.net'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  console.log(`User Management running on port ${process.env.PORT ?? 3000}`);
}
bootstrap().catch(console.error);
