/* eslint-disable @typescript-eslint/no-unsafe-call */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from './uploads/upload.module';
import { ConfigModule } from '@nestjs/config';
import { FrontendModule } from './frontend/frontend.module';
import { SessionMiddleware } from './sessionManagement/session.middleware';

// Log the DB_URI environment variable for debugging purposes before initializing Mongoose.
console.log('DB_URI:', process.env.DB_URI);

@Module({
  imports: [
    // Load configuration from the .env file to access environment variables.
    ConfigModule.forRoot(),
    // Connect to the MongoDB instance using environment variables for credentials and settings.
    MongooseModule.forRoot(process.env.DB_URI || '', {}),
    UploadModule,
    FrontendModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Use cookie-parser globally
    consumer.apply(cookieParser()).forRoutes('*');

    // Use custom session middleware globally
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}

// // app.module.ts
// import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { SessionMiddleware } from './session.middleware'; // adjust path if needed

// @Module({
//   imports: [],
//   controllers: [],
//   providers: [],
// })
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(SessionMiddleware).forRoutes('*'); // ✅ Apply to all routes
//   }
// }
