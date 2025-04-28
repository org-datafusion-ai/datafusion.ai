import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
// import { ConfigModule } from '@nestjs/config';  // to access .env

@Module({
    // imports: [
    //     ConfigModule.forRoot({
    //       isGlobal: true, //
    //     }),
    //   ],
    
  providers: [AIService], 
  exports: [AIService],   
})
export class AIModule {}