import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UploadService } from '../src/uploads/upload.service';
import { AIService } from '../src/ai/ai.service';
import { Upload } from '../src/uploads/upload.schemas';


import * as mammoth from 'mammoth';
import * as xlsx from 'xlsx';
import { Model } from 'mongoose';

jest.mock('pdf-parse', () => jest.fn().mockResolvedValue({ text: 'Mocked PDF content' }));
import pdfParse from 'pdf-parse';

jest.mock('mammoth');
jest.mock('xlsx');

describe('UploadService', () => {
  let service: UploadService;
  let model: Model<Upload>;
  let aiService: AIService;
  
  const mockUploadModel = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue(data),
  })) as any;

  mockUploadModel.find = jest.fn();
  mockUploadModel.findById = jest.fn();
  mockUploadModel.deleteMany = jest.fn();

  const mockAIService = {
    extractInformation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: getModelToken(Upload.name), useValue: mockUploadModel },
        { provide: AIService, useValue: mockAIService },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    model = module.get<Model<Upload>>(getModelToken(Upload.name));
    aiService = module.get<AIService>(AIService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUpload', () => {
    it('should handle .txt files correctly', async () => {
      const file = {
        originalname: 'example.txt',
        mimetype: 'text/plain',
        buffer: Buffer.from('Hello\n\n\nworld\nworld'),
      } as Express.Multer.File;

      const sessionToken = 'session123';

      mockAIService.extractInformation.mockResolvedValue({ info: 'extracted' });

      const mockSave = jest.fn().mockResolvedValue({
        title: file.originalname,
        contentInStr: 'Hello\nworld',
        processedData: { info: 'extracted' },
      });

      (model as any).constructor = jest.fn().mockImplementation(() => ({
        save: mockSave,
      }));

      const result = await service.createUpload(file, sessionToken, '.txt');

      expect(result.title).toBe('example.txt');
      expect(mockAIService.extractInformation).toHaveBeenCalledWith('Hello\nworld');
    });

    it('should handle .pdf files correctly', async () => {
      const file = {
        originalname: 'document.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from('fake pdf content'),
      } as Express.Multer.File;

      const originalBuffer = file.buffer;
      mockAIService.extractInformation.mockResolvedValue({ summary: 'extracted' });

      const mockSave = jest.fn().mockResolvedValue({
        title: file.originalname,
        contentInStr: 'Mocked PDF content',
        processedData: { summary: 'extracted' },
      });

      (model as any).constructor = jest.fn().mockImplementation(() => ({
        save: mockSave,
      }));

      const result = await service.createUpload(file, 'session123', '.pdf');

      expect(result.contentInStr).toBe('Mocked PDF content');
      expect(pdfParse).toHaveBeenCalledWith(originalBuffer);
    });

    it('should throw for unsupported file types', async () => {
      const file = {
        originalname: 'invalid.xyz',
        mimetype: 'application/octet-stream',
        buffer: Buffer.from('data'),
      } as Express.Multer.File;

      await expect(
        service.createUpload(file, 'session123', '.xyz'),
      ).rejects.toThrow('Unsupported file type');
    });
  });

  describe('getAllUploads', () => {
    it('should return all uploads', async () => {
      const data = [{ id: 1 }, { id: 2 }];
      mockUploadModel.find.mockReturnValue({ populate: () => ({ exec: () => data }) });

      const result = await service.getAllUploads();
      expect(result).toBe(data);
    });
  });

  describe('getUploadById', () => {
    it('should return upload by ID', async () => {
      const mockUpload = { id: 'abc123' };
      mockUploadModel.findById.mockReturnValue({
        populate: () => ({
          exec: () => mockUpload,
        }),
      });

      const result = await service.getUploadById('abc123');
      expect(result).toEqual(mockUpload);
    });

    it('should throw if upload not found', async () => {
      mockUploadModel.findById.mockReturnValue({
        populate: () => ({
          exec: () => null,
        }),
      });

      await expect(service.getUploadById('missing')).rejects.toThrow();
    });
  });

  describe('getUploadBySession', () => {
    it('should return uploads by session token', async () => {
      const uploads = [{ uploadedBy: 'abc' }];
      mockUploadModel.find.mockReturnValue({ exec: () => uploads });

      const result = await service.getUploadBySession('abc');
      expect(result).toEqual(uploads);
    });

    it('should throw if none found', async () => {
      mockUploadModel.find.mockReturnValue({ exec: () => [] });

      await expect(service.getUploadBySession('missing')).rejects.toThrow();
    });
  });

  describe('updateProcessedData', () => {
    it('should update and return upload', async () => {
      const mockUpload = {
        processedData: {},
        save: jest.fn().mockResolvedValue({ processedData: { updated: true } }),
      };
      jest.spyOn(service, 'getUploadById').mockResolvedValue(mockUpload as any);

      const result = await service.updateProcessedData('id', { updated: true });
      expect(result).toEqual({ processedData: { updated: true } });
    });
  });

  describe('deleteUploadsBySession', () => {
    it('should delete by sessionToken', async () => {
      mockUploadModel.deleteMany.mockResolvedValue(undefined);

      await expect(
        service.deleteUploadsBySession('session123'),
      ).resolves.toBeUndefined();
      expect(mockUploadModel.deleteMany).toHaveBeenCalledWith({
        sessionToken: 'session123',
      });
    });
  });

  describe('utility functions', () => {
    it('should remove extra newlines', () => {
      const input = 'line1\n\n\nline2\n';
      const output = service.removeExtraNewLines(input);
      expect(output).toBe('line1\nline2\n');
    });

    it('should remove duplicate lines', () => {
      const input = 'line1\nline2\nline1\nline3';
      const output = service.removeDuplicates(input);
      expect(output).toBe('line1\nline2\nline3');
    });

    it('should remove extra commas', () => {
      const input = 'a,,,b,,c';
      const output = service.removeExtraCommas(input);
      expect(output).toBe('a,b,c');
    });

    it('should generate unique ID', () => {
      const id = service['generateUniqueId']('report.docx');
      expect(id).toMatch(/^\d+_report\.docx$/);
    });
  });
});