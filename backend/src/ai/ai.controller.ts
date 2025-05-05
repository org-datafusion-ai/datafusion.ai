import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { AIService } from './ai.service';

@Controller('extraction')
export class ExtractionController {
  constructor(private readonly aiService: AIService) {}

  @Post()
  async handleExtraction(@Body('content') content: string): Promise<any> {
    return await this.aiService.extractInformation(content);
  }
}