import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from './uploads/upload.module';
import { ConfigModule } from '@nestjs/config';
import { CsvModule } from './csv/csv.module';
import { FrontendModule } from './frontend/frontend.module';
import { SessionMiddleware } from './sessionManagement/session.middleware';
import { SessionController } from './sessionManagement/session.controller';

// Log the DB_URI environment variable for debugging purposes before initializing Mongoose.
console.log('DB_URI:', process.env.DB_URI);

@Module({
  imports: [
    // Load configuration from the .env file to access environment variables.
    ConfigModule.forRoot(),
    // Connect to the MongoDB instance using environment variables for credentials and settings.
    MongooseModule.forRoot(process.env.DB_URI || '', {}),
    UploadModule,
    CsvModule,
    FrontendModule,
  ],
  controllers: [SessionController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
