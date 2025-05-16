import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from './uploads/upload.module';
import { ConfigModule } from '@nestjs/config';
import { CsvModule } from './csv/csv.module';
import { FrontendModule } from './frontend/frontend.module';
import { SessionMiddleware } from './sessionManagement/session.middleware';
import { SessionController } from './sessionManagement/session.controller';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI || '', {
      user: process.env.DB_USERNAME,
      pass: process.env.DB_PASSWORD,
      authSource: 'admin',
    }),
    UploadModule,
    CsvModule,
    FrontendModule,
    AIModule,
  ],
  controllers: [SessionController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
