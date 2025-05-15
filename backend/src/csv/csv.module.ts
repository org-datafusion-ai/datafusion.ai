import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { CsvController } from './csv.controller';
import { UploadService } from '../uploads/upload.service';
import { UploadModule } from '../uploads/upload.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Upload, UploadSchema } from '../uploads/upload.schemas';
import { AIModule } from 'src/ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Upload.name, schema: UploadSchema }]),
    UploadModule,
    AIModule
  ],
  controllers: [CsvController],
  providers: [CsvService, UploadService],
})
export class CsvModule {}
