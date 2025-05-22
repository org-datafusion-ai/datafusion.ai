import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from '../src/uploads/upload.controller';
import { UploadService } from '../src/uploads/upload.service';
import { Request } from 'express';

describe('UploadController', () => {
  let controller: UploadController;
  let service: UploadService;

  const mockUploadService = {
    createUpload: jest.fn(),
    getAllUploads: jest.fn(),
    getUploadById: jest.fn(),
    updateProcessedData: jest.fn(),
    deleteUploadsBySession: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should return processed upload results', async () => {
      const files = [
        { originalname: 'test.pdf' } as Express.Multer.File,
      ];
      const req = { cookies: { session_token: 'abc123' } } as Request;

      mockUploadService.createUpload.mockResolvedValueOnce({
        contentInStr: 'mock content',
      });

      const result = await controller.uploadFile(files, req);

      expect(result).toEqual({
        message: 'File uploaded successfully',
        contentInStr: [
          {
            filename: 'test.pdf',
            contentInStr: 'mock content',
          },
        ],
      });

      expect(service.createUpload).toHaveBeenCalledWith(
        files[0],
        'abc123',
        '.pdf',
      );
    });
  });

  describe('getAllUploads', () => {
    it('should return all uploads', async () => {
      const uploads = [{ id: '1' }, { id: '2' }];
      mockUploadService.getAllUploads.mockResolvedValue(uploads);

      const result = await controller.getAllUploads();
      expect(result).toEqual(uploads);
    });
  });

  describe('getUploadById', () => {
    it('should return upload by ID', async () => {
      const upload = { id: '1', name: 'file.txt' };
      mockUploadService.getUploadById.mockResolvedValue(upload);

      const result = await controller.getUploadById('1');
      expect(result).toEqual(upload);
    });
  });

  describe('updateProcessedData', () => {
    it('should update processed data for an upload', async () => {
      const id = 'abc123';
      const processedData = { key: 'value' };
      const updatedUpload = { id, data: processedData };

      mockUploadService.updateProcessedData.mockResolvedValue(updatedUpload);

      const result = await controller.updateProcessedData(id, processedData);
      expect(result).toEqual({
        message: 'Processed data updated successfully',
        updatedUpload,
      });
    });
  });

  describe('deleteUploadsBySession', () => {
    it('should delete uploads by session token', async () => {
      mockUploadService.deleteUploadsBySession.mockResolvedValue(undefined);

      const result = await controller.deleteUploadsBySession('abc123');
      expect(result).toEqual({
        message: 'Uploads for this session deleted successfully',
      });
      expect(service.deleteUploadsBySession).toHaveBeenCalledWith('abc123');
    });
  });
});