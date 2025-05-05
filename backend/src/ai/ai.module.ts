import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { ConfigModule } from '@nestjs/config';  // to access .env
import { ExtractionController } from './ai.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
          isGlobal: true, //
        }),
      ],

  providers: [AIService], 
  exports: [AIService],   
})
export class AIModule {}