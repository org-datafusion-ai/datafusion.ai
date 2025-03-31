import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from '../src/uploads/upload.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from '../src/uploads/upload.schemas';
import { NotFoundException } from '@nestjs/common';

describe('UploadService', () => {
  let service: UploadService;
  let uploadModel: Model<UploadDocument>;

  // Mock implementation of the Upload model
  const mockUploadModel = {
    create: jest.fn(), // Mock for the create method
    find: jest.fn().mockReturnThis(), // Mock for the find method
    findById: jest.fn(), // Mock for the findById method
    findByIdAndDelete: jest.fn(), // Mock for the findByIdAndDelete method
    populate: jest.fn().mockReturnThis(), // Mock for the populate method
    exec: jest.fn(), // Mock for the exec method
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: getModelToken(Upload.name), useValue: mockUploadModel },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    uploadModel = module.get<Model<UploadDocument>>(getModelToken(Upload.name));
  });

  // Test case for successfully creating and saving a valid file upload
  it('should create and save a valid file upload', async () => {
    const mockFile = { originalname: 'test.pdf', mimetype: 'text/plain', buffer: Buffer.from('test buffer') } as Express.Multer.File;
    const mockUserId = 'user123';
    const mockSavedUpload = { save: jest.fn().mockResolvedValue(true) };

    jest.spyOn(uploadModel, 'create').mockReturnValue(mockSavedUpload as any);
    jest.spyOn(mockSavedUpload, 'save').mockResolvedValue(mockSavedUpload as any);

    const result = await service.createUpload(mockFile, mockUserId);

    expect(uploadModel.create).toHaveBeenCalledWith(expect.objectContaining({
      title: mockFile.originalname,
      type: mockFile.mimetype,
      uploadedBy: mockUserId,
    }));
    expect(result).toBe(mockSavedUpload);
  });

  // Test case for rejecting unsupported file types
  it('should throw an error for unsupported file types', async () => {
    const mockFile = { originalname: 'test.xyz', mimetype: 'application/xyz', buffer: Buffer.from('test buffer') } as Express.Multer.File;
    const mockUserId = 'user123';

    await expect(service.createUpload(mockFile, mockUserId)).rejects.toThrow(
      new NotFoundException(`File type \"application/xyz\" is not allowed. Only PDF, Word, Excel, and TXT files are supported.`)
    );
  });

  // Test case for retrieving all uploads
  it('should retrieve all uploads', async () => {
    const mockUploads = [
            { id: '1', title: 'TestFile1.txt', type: 'text/plain', uploadedBy: 'user123' },
            { id: '2', title: 'TestFile2.pdf', type: 'application/pdf', uploadedBy: 'user456' },
          ];
  
    jest.spyOn(uploadModel, 'find').mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockUploads),
    } as any); 
  
    const result = await service.getAllUploads();
    expect(result).toEqual(mockUploads);
  });

  // Test case for retrieving a specific upload by ID
  it('should retrieve an upload by ID', async () => {
    const mockUpload = { _id: '1234', id:'20221009test.txt', title: 'TestFile1.txt', type: 'text/plain', uploadedBy: 'user123' };
    
    jest.spyOn(uploadModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUpload),
      } as any);
      
    // jest.spyOn(uploadModel, 'populate').mockReturnThis();
    // jest.spyOn(uploadModel.findById('mockId'), 'exec').mockResolvedValue(mockUpload);

    const result = await service.getUploadById('1234');
    expect(result).toEqual(mockUpload);
  });

  it('should throw NotFoundException when retrieving a non-existent upload', async () => {
    jest.spyOn(uploadModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null), // Ensure this returns null
      } as any);
    // jest.spyOn(uploadModel, 'populate').mockReturnThis();
    // jest.spyOn(uploadModel, 'exec').mockResolvedValue(null);

    await expect(service.getUploadById('1234')).rejects.toThrow(NotFoundException);
  });

  it('should update processed data for an upload', async () => {
    const mockUpload = { 
      _id: '1234', 
      title: 'TestFile1.txt', 
      type: 'text/plain', 
      uploadedBy: 'user123',
      processedData: {}, // Ensure processedData exists
      save: jest.fn().mockResolvedValue(true) // Mock save method
    };
  
    jest.spyOn(service, 'getUploadById').mockResolvedValue(mockUpload as any);
  
    const result = await service.updateProcessedData('1234', { key: 'value' });
  
    expect(mockUpload.processedData).toEqual({ key: 'value' });
    expect(mockUpload.save).toHaveBeenCalled();
  });
  

// Test case for deleting an upload
it('should delete an upload', async () => {
    jest.spyOn(uploadModel, 'findByIdAndDelete').mockReturnValue({
      exec: jest.fn().mockResolvedValue(true) // Ensure exec() is mocked
    } as any);
    
    await expect(service.deleteUpload('mockId')).resolves.toBeUndefined();
  });
  
  it('should throw NotFoundException when deleting a non-existent upload', async () => {
    jest.spyOn(uploadModel, 'findByIdAndDelete').mockReturnValue({
      exec: jest.fn().mockResolvedValue(null) // Ensure exec() is mocked
    } as any);
  
    await expect(service.deleteUpload('mockId')).rejects.toThrow(NotFoundException);
  });
})
