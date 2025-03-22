import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from '../src/uploads/upload.controller';
import { UploadService } from '../src/uploads/upload.service';

describe('UploadController', () => {
  let controller: UploadController;
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService, // Provide a mock of UploadService
          useValue: {
            getAllUploads: jest.fn().mockResolvedValue([
              { id: '1', title: 'TestFile1.txt', type: 'text/plain', uploadedBy: 'user123' },
              { id: '2', title: 'TestFile2.pdf', type: 'application/pdf', uploadedBy: 'user456' },
            ]),
          },
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return all uploads', async () => {
    const result = await controller.getAllUploads();

    expect(result).toEqual([
      { id: '1', title: 'TestFile1.txt', type: 'text/plain', uploadedBy: 'user123' },
      { id: '2', title: 'TestFile2.pdf', type: 'application/pdf', uploadedBy: 'user456' },
    ]);

    expect(service.getAllUploads).toHaveBeenCalled();
  });
});


// import { Test, TestingModule } from '@nestjs/testing';
// import { UploadController } from './upload.controller';

// describe('UploadController', () => {
//   let controller: UploadController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UploadController],
//     }).compile();

//     controller = module.get<UploadController>(UploadController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
