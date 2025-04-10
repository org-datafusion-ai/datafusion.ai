import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// TODO: Delete later.
import { AIService } from './ai/ai.service'; // Import AIService


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // if you're using cookies/auth headers
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
