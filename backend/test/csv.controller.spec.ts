import { Test, TestingModule } from '@nestjs/testing';
import { CsvController } from '../src/csv/csv.controller';
import { CsvService } from '../src/csv/csv.service';
import { Request, Response } from 'express';

describe('CsvController', () => {
  let controller: CsvController;
  let csvService: CsvService;

  const mockCsvService = {
    generateCsv: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsvController],
      providers: [{ provide: CsvService, useValue: mockCsvService }],
    }).compile();

    controller = module.get<CsvController>(CsvController);
    csvService = module.get<CsvService>(CsvService);
  });

  describe('previewCsv', () => {
    it('should return generated CSV string', async () => {
      const mockRequest = { cookies: { session_token: 'abc123' } } as unknown as Request;
      mockCsvService.generateCsv.mockResolvedValue('label,value\nName,Nicole');

      const result = await controller.previewCsv(mockRequest);

      expect(csvService.generateCsv).toHaveBeenCalledWith('abc123');
      expect(result).toBe('label,value\nName,Nicole');
    });
  });

  describe('generateCsvDownload', () => {
    it('should set headers and send CSV as attachment', async () => {
      const mockRequest = { cookies: { session_token: 'abc123' } } as unknown as Request;
      const mockResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      mockCsvService.generateCsv.mockResolvedValue('label,value\nName,Nicole');

      await controller.generateCsvDownload(mockRequest, mockResponse);

      expect(csvService.generateCsv).toHaveBeenCalledWith('abc123');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename="generated.csv"');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith('label,value\nName,Nicole');
    });

    it('should handle errors and send 500', (done) => {
        const mockRequest = {
          cookies: { session_token: 'abc123' },
        } as unknown as Request;
      
        const mockStatus = jest.fn().mockReturnThis();
        const mockSend = jest.fn();
        const mockResponse = {
          setHeader: jest.fn(),
          status: mockStatus,
          send: mockSend,
        } as unknown as Response;
      
        mockCsvService.generateCsv.mockRejectedValue(new Error('Generation failed'));
      
        controller.generateCsvDownload(mockRequest, mockResponse)
          .then(() => {
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockSend).toHaveBeenCalledWith('Failed to generate CSV');
            done();
          })
          .catch(done);
      });
      
  });
});
