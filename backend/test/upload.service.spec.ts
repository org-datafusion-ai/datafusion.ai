import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UploadService } from '../src/uploads/upload.service';
import { AIService } from '../src/ai/ai.service';
import { Upload } from '../src/uploads/upload.schemas';
import { NotFoundException } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as xlsx from 'xlsx';

describe('UploadService', () => {
  let service: UploadService;
  let uploadModel: any;
  let aiService: any;

  const mockUploadDoc = {
    save: jest.fn().mockResolvedValue('saved upload'),
    _id: '123',
    processedData: {},
  };

  const mockUploadModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOne: jest.fn(),
    exec: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: getModelToken(Upload.name),
          useValue: {
            ...mockUploadModel,
            find: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ exec: jest.fn() }) }),
            findById: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ exec: jest.fn() }) }),
            findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn() }),
          },
        },
        {
          provide: AIService,
          useValue: {
            extractInformation: jest.fn().mockResolvedValue({ key: 'value' }),
          },
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    uploadModel = module.get(getModelToken(Upload.name));
    aiService = module.get<AIService>(AIService);
  });

  describe('createUpload', () => {
    it('should process a .txt file and save the upload', async () => {
      const file = {
        originalname: 'test.txt',
        buffer: Buffer.from('Test content\nTest content'),
        mimetype: 'text/plain',
      } as Express.Multer.File;

      const mockSave = jest.fn().mockResolvedValue(mockUploadDoc);
      (service as any).uploadModel = jest.fn().mockImplementation(() => ({
        ...mockUploadDoc,
        save: mockSave,
      }));
      

      const result = await service.createUpload(file, 'token123', '.txt');

      expect(result).toBe(mockUploadDoc);
      expect(aiService.extractInformation).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
    });

    it('should throw for unsupported file types', async () => {
      const file = {
        originalname: 'bad.exe',
        buffer: Buffer.from(''),
        mimetype: 'application/octet-stream',
      } as Express.Multer.File;

      await expect(service.createUpload(file, 'token123', '.exe')).rejects.toThrow(
        'Unsupported file type. Please upload a valid file.'
      );
    });
  });

  describe('getAllUploads', () => {
    it('should return all uploads', async () => {
      const mockData = [{ id: 1 }];
      uploadModel.find().populate().exec.mockResolvedValue(mockData);

      const result = await service.getAllUploads();
      expect(result).toBe(mockData);
    });
  });

  describe('getUploadById', () => {
    it('should return upload by id', async () => {
      uploadModel.findById().populate().exec.mockResolvedValue(mockUploadDoc);

      const result = await service.getUploadById('123');
      expect(result).toBe(mockUploadDoc);
    });

    it('should throw if upload not found', async () => {
      uploadModel.findById().populate().exec.mockResolvedValue(null);

      await expect(service.getUploadById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUploadBySession', () => {
    it('should return uploads for a session', async () => {
      const mockData = [{ id: 1 }];
      uploadModel.find.mockReturnValueOnce({ exec: jest.fn().mockResolvedValue(mockData) });

      const result = await service.getUploadBySession('token123');
      expect(result).toBe(mockData);
    });

    it('should throw if no uploads found', async () => {
      uploadModel.find.mockReturnValueOnce({ exec: jest.fn().mockResolvedValue([]) });

      await expect(service.getUploadBySession('token123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProcessedData', () => {
    it('should update processedData field', async () => {
      const updated = { ...mockUploadDoc, save: jest.fn().mockResolvedValue('updated') };
      jest.spyOn(service, 'getUploadById').mockResolvedValue(updated as any);

      const result = await service.updateProcessedData('123', { a: 1 });
      expect(result).toBe('updated');
      expect(updated.save).toHaveBeenCalled();
    });
  });

  describe('deleteUpload', () => {
    it('should delete upload', async () => {
      uploadModel.findByIdAndDelete().exec.mockResolvedValue(true);
      await expect(service.deleteUpload('123')).resolves.toBeUndefined();
    });

    it('should throw if upload not found', async () => {
      uploadModel.findByIdAndDelete().exec.mockResolvedValue(null);
      await expect(service.deleteUpload('123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeExtraNewLines', () => {
    it('should collapse multiple new lines', () => {
      const input = 'line1\n\n\nline2\n\nline3';
      const result = service.removeExtraNewLines(input);
      expect(result).toBe('line1\nline2\nline3');
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicate lines', () => {
      const input = 'line1\nline2\nline1\nline3\nline2';
      const result = service.removeDuplicates(input);
      expect(result).toBe('line1\nline2\nline3');
    });
  });
});
