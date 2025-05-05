/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieParser = require('cookie-parser');

// TODO: Delete later.
import { AIService } from './ai/ai.service'; // Import AIService


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CORS ?? 'http://localhost"',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  app.enableCors();
  console.log(`Application is running on: http://localhost:${port}`);

    // // Retrieve AIService from the application context
    // const aiService = app.get(AIService);

    // // Call the testAPIConnection method
    // try {
    //   await aiService.testAPIConnection();
    // } catch (error) {
    //   console.error('Error testing API connection:', error.message);
    // }
  
}
void bootstrap();
