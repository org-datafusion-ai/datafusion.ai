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

    console.log("This is inside of extractInformation function:", fileContent);
    console.log("---------------");
    console.log("This is the endpoint:", this.endpoint);

    // Define the chat-completion request payload
    const requestBody = {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: buildPrompt(fileContent),
        }
      ],
      max_tokens: 1000,
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

      console.log('Response Data:', response.data);

      // Extract the response content
      //   const gptResponse = response.data.choices[0].message.content.trim();
      const gptResponse = response.data.choices[0].message.content;
      console.log('Raw GPT Response:', gptResponse);
      // Validate and Parse the JSON returned by GPT
      let extractedData;
      try {
        extractedData = JSON.parse(gptResponse.trim()); // Clean up and parse the response
        // console.log('Extracted Data:', extractedData);
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

      // Return the extracted data
      return extractedData;

      // Parse the JSON returned by GPT
      //   return JSON.parse(gptResponse);
    } catch (error) {
      console.error(
        'Failed to process GPT request:',
        error.response?.data || error.message,
      );

      // Throw an HTTP exception with more details
      throw new HttpException(
        'Failed to process GPT request. Please check the API connection or request format.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}


