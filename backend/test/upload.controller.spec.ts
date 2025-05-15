import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from '../src/uploads/upload.controller';
import { UploadService } from '../src/uploads/upload.service';
import { Request } from 'express';

describe('UploadController', () => {
  let controller: UploadController;
  let uploadService: UploadService;

  const mockUploadService = {
    createUpload: jest.fn(),
    getAllUploads: jest.fn(),
    getUploadById: jest.fn(),
    updateProcessedData: jest.fn(),
    deleteUpload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [{ provide: UploadService, useValue: mockUploadService }],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    uploadService = module.get<UploadService>(UploadService);
  });

  describe('uploadFile', () => {
    it('should upload files and return results', async () => {
      const mockFiles = [
        { originalname: 'file1.pdf' },
        { originalname: 'file2.docx' },
      ] as Express.Multer.File[];

      const mockRequest = {
        cookies: { session_token: 'abc123' },
      } as unknown as Request;

      mockUploadService.createUpload
        .mockResolvedValueOnce({ contentInStr: 'File1 content' })
        .mockResolvedValueOnce({ contentInStr: 'File2 content' });

      const result = await controller.uploadFile(mockFiles, mockRequest);

      

      expect(result).toEqual({
        message: 'File uploaded successfully',
        contentInStr: [
          { filename: 'file1.pdf', contentInStr: 'File1 content' },
          { filename: 'file2.docx', contentInStr: 'File2 content' },
        ],
      });

      expect(mockUploadService.createUpload).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAllUploads', () => {
    it('should return all uploads', async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      mockUploadService.getAllUploads.mockResolvedValue(mockData);
      const result = await controller.getAllUploads();
      expect(result).toEqual(mockData);
    });
  });

  describe('getUploadById', () => {
    it('should return the upload with the given id', async () => {
      const mockUpload = { id: '123', content: 'data' };
      mockUploadService.getUploadById.mockResolvedValue(mockUpload);
      const result = await controller.getUploadById('123');
      expect(result).toEqual(mockUpload);
    });
  });

  describe('updateProcessedData', () => {
    it('should update processed data and return updated upload', async () => {
      const updated = { id: '123', processedData: { key: 'value' } };
      mockUploadService.updateProcessedData.mockResolvedValue(updated);
      const result = await controller.updateProcessedData('123', { key: 'value' });
      expect(result).toEqual({
        message: 'Processed data updated successfully',
        updatedUpload: updated,
      });
    });
  });

  describe('deleteUpload', () => {
    it('should delete the upload and return success message', async () => {
      mockUploadService.deleteUpload.mockResolvedValue(undefined);
      const result = await controller.deleteUpload('123');
      expect(result).toEqual({ message: 'Upload deleted successfully' });
    });
  });
});
