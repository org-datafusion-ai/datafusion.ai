import { CsvService } from "../src/csv/csv.service";
import { UploadService } from '../src/uploads/upload.service';

describe('CsvService', () => {
  let csvService: CsvService;
  let uploadService: UploadService;

  const mockUploadService = {
    getUploadBySession: jest.fn(),
  };

  beforeEach(() => {
    uploadService = mockUploadService as unknown as UploadService;
    csvService = new CsvService(uploadService);
  });

  describe('generateCsv', () => {
    it('should generate CSV from uploaded processed data', async () => {
      const mockUploads = [
        {
          processedData: {
            name: 'Nicole',
            details: {
              role: 'Developer',
              skills: ['TypeScript', 'NestJS']
            },
          }
        },
        {
          processedData: {
            name: 'James',
            age: 25
          }
        },
      ];

      mockUploadService.getUploadBySession.mockResolvedValue(mockUploads);

      const result = await csvService.generateCsv('abc123');

      expect(mockUploadService.getUploadBySession).toHaveBeenCalledWith('abc123');

      // Basic check for expected content
      expect(result).toContain('Record 1');
      expect(result).toContain('name,Nicole');
      expect(result).toContain('role,Developer');
      expect(result).toContain('skills,TypeScript');
      expect(result).toContain('skills,NestJS');
      expect(result).toContain('Record 2');
      expect(result).toContain('age,24');
    });

    it('should return empty CSV if no uploads exist', async () => {
      mockUploadService.getUploadBySession.mockResolvedValue([]);

      const result = await csvService.generateCsv('abc123');
      expect(result).toBe('');
    });

    it('should handle missing processedData gracefully', async () => {
      const mockUploads = [{}, { processedData: null }];
      mockUploadService.getUploadBySession.mockResolvedValue(mockUploads);

      const result = await csvService.generateCsv('abc123');
      expect(result).toBe('\n\nRecord 2\n\n');
    });
  });
});
