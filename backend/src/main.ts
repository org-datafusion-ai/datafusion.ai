import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
}
void bootstrap();
