import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Upload, UploadSchema } from './upload.schemas';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([
    { name: Upload.name, schema: UploadSchema }

  ]),
  AIModule
],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
