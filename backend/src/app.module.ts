import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from './uploads/upload.module';
import { AuthModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import { FrontendModule } from './frontend/frontend.module';

// Log the DB_URI environment variable for debugging purposes before initializing Mongoose.
console.log('DB_URI:', process.env.DB_URI);

// Uncomment the following block to use the Azure MongoDB instance.
@Module({
  imports: [
    // Load configuration from the .env file to access environment variables.
    ConfigModule.forRoot(),
    // Connect to the MongoDB instance using environment variables for credentials and settings.
    MongooseModule.forRoot(process.env.DB_URI || '', {}),
    UploadModule,
    AuthModule,
    FrontendModule,
  ],
})
export class AppModule {}
