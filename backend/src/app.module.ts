import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from './uploads/upload.module';
import { ConfigModule } from '@nestjs/config';  // to access .env
import { AuthModule } from './users/user.module';
import { AIModule } from './ai/ai.module';

// Log the DB_URI environment variable for debugging purposes before initializing Mongoose.
// TODO: delete after testing!
// console.log('DB_URI:', process.env.DB_URI);

// Uncomment the following block to use the Azure MongoDB instance.
// @Module({
//   imports: [
//     // Load configuration from the .env file to access environment variables.
//     ConfigModule.forRoot(),
//     // Connect to the MongoDB instance using environment variables for credentials and settings.
//     MongooseModule.forRoot(process.env.DB_URI || '', {
//     user: process.env.DB_USERNAME,
//     pass: process.env.DB_PASSWORD,
//     authSource: 'admin', // Authentication source set to "admin".
//   }),
//     UploadModule,
//     AuthModule,
//     AIModule,
//   ],
// })


// Uncomment the following block to use the local MongoDB instance for development or testing purposes.
console.log('App.moudules.DB_URI:', process.env.DB_URI);
@Module({
  imports: [
        // Load configuration from the .env file to access environment variables.
    // ConfigModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true, // 如果你希望在所有模組中都能訪問 .env
    }),
    MongooseModule.forRoot('mongodb://localhost/datafusion'),
    UploadModule,
    AuthModule,
    AIModule,
  ],
})
export class AppModule {}
