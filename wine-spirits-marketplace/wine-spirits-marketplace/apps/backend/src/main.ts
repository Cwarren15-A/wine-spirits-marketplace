import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe for input sanitization
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  // Set global prefix for API versioning
  app.setGlobalPrefix('api/v1');
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  logger.log(`🍷 Wine & Spirits Marketplace API running on port ${port}`);
  logger.log(`📋 Compliance mode: TTB Circular 2023-1 & CA ABC Advisory`);
}

bootstrap(); 