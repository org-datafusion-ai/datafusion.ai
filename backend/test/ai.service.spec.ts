import { Test, TestingModule } from '@nestjs/testing';
import { AIService } from '../src/ai/ai.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { HttpException } from '@nestjs/common';
import { buildPrompt } from '../src/ai/ai.prompt';

jest.mock('axios');
jest.mock('../src/ai/ai.prompt', () => ({
  buildPrompt: jest.fn((content: string) => `Processed: ${content}`),
}));

describe('AIService', () => {
  let service: AIService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'AZURE_GPT4_ENDPOINT') return 'https://fake-endpoint.com';
      if (key === 'AZURE_GPT4_API_KEY') return 'fake-api-key';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AIService>(AIService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call Azure and return parsed JSON data', async () => {
    const mockResponse = {
      data: {
        choices: [
          {
            message: {
              content: JSON.stringify({ name: 'Nicole', role: 'Dev' }),
            },
          },
        ],
      },
    };

    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await service.extractInformation('sample text');
    expect(buildPrompt).toHaveBeenCalledWith('sample text');
    expect(result).toEqual({ name: 'Nicole', role: 'Dev' });
  });

  it('should throw an error if GPT response is not valid JSON', async () => {
    const mockResponse = {
      data: {
        choices: [
          {
            message: {
              content: 'not a json',
            },
          },
        ],
      },
    };

    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    await expect(service.extractInformation('sample text')).rejects.toThrow(HttpException);
  });

  it('should throw HttpException if axios fails', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('Network Error'));

    await expect(service.extractInformation('sample text')).rejects.toThrow(HttpException);
  });
});
