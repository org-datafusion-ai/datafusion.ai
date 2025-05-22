import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieParser = require('cookie-parser');
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CORS ?? 'http://localhost"',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('DatafusionAI')
    .setDescription('API documentation for DatafusionAI')
    .setVersion('1.0')
    .addTag('example')
    .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [],
      deepScanRoutes: true,
      ignoreGlobalPrefix: false,
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        controllerKey === 'FrontendController' ? `${controllerKey}_${methodKey}` : `${controllerKey}_${methodKey}`,
    });
    
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  app.enableCors();

}
void bootstrap();
