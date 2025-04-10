import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
// import { ConfigModule } from '@nestjs/config';  // to access .env

@Module({
    // imports: [
    //     ConfigModule.forRoot({
    //       isGlobal: true, // 如果你希望在所有模組中都能訪問 .env
    //     }),
    //   ],
    
  providers: [AIService], // 定義 AIService 為提供者
  exports: [AIService],   // 將 AIService 匯出，供其他模組使用
})
export class AIModule {}