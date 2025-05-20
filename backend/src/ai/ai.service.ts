import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // to access .env
import { ConfigService } from '@nestjs/config';
import { buildPrompt } from './ai.prompt';

import axios from 'axios';

@Injectable()
export class AIService {
  private endpoint: string;
  private apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.endpoint = this.configService.get<string>('AZURE_GPT4_ENDPOINT') || '';
    this.apiKey = this.configService.get<string>('AZURE_GPT4_API_KEY') || '';

    // Checking if the env variables are loaded
    if (!this.endpoint) {
      throw new Error(
        'AZURE_GPT4_ENDPOINT is not defined in environment variables.',
      );
    }
    if (!this.apiKey) {
      throw new Error(
        'AZURE_GPT4_API_KEY is not defined in environment variables.',
      );
    }
  }

  async extractInformation(fileContent: string): Promise<any> {

    // Define the chat-completion request payload
    const requestBody = {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: buildPrompt(fileContent),
        }
      ],
      max_tokens: 3000,  // change the numbers of the return tokens
      temperature: 0.7,
    };

    const headers = {
      'Content-Type': 'application/json',
      'api-key': this.apiKey,
    };

    try {
      const response = await axios.post(this.endpoint, requestBody, {
        headers,
      });


      const gptResponse = response.data.choices[0].message.content;
      let extractedData;
      try {
        extractedData = JSON.parse(gptResponse.trim());
      } catch (parseError) {
        console.error(
          'Failed to parse GPT response into JSON:',
          parseError.message,
        );
        throw new HttpException(
          'GPT response is not a valid JSON format. Please adjust your prompt or try again.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return extractedData;

    } catch (error) {
      console.error(
        'Failed to process GPT request:',
        error.response?.data || error.message,
      );

      throw new HttpException(
        'Failed to process GPT request. Please check the API connection or request format.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}


