import { CsvService } from "../src/csv/csv.service";
import { UploadService } from '../src/uploads/upload.service';

describe('CsvService', () => {
  let csvService: CsvService;
  let uploadService: UploadService;

  const mockUploadService = {
    getUploadBySession: jest.fn(),
  };

  beforeEach(() => {
    csvService = new CsvService(mockUploadService as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCsv', () => {
    it('should generate CSV from uploaded processed data', async () => {
      const sessionToken = 'mockSession123';

      // Mock uploads
      mockUploadService.getUploadBySession.mockResolvedValue([
        {
          processedData: {
            name: 'Nicole',
            age: 25,
            details: {
              role: 'Developer',
              skills: ['TypeScript', 'NestJS'],
            },
          },
        },
        {
          processedData: {
            name: 'James',
          },
        },
      ]);

      const csv = await csvService.generateCsv(sessionToken);

      expect(typeof csv).toBe('string');
      expect(csv).toContain('name,Nicole,James');
      expect(csv).toContain('age,25');
      expect(csv).toContain('details - role,Developer');
      expect(csv).toContain('details - skills,"TypeScript,NestJS"');
    });

    it('should handle empty processedData gracefully', async () => {
      mockUploadService.getUploadBySession.mockResolvedValue([
        { processedData: {} },
        { processedData: null },
      ]);

      const csv = await csvService.generateCsv('empty-session');

      expect(csv).toBe('');
    });

    it('should handle arrays of nested objects', async () => {
      mockUploadService.getUploadBySession.mockResolvedValue([
        {
          processedData: {
            history: [
              { year: 2020, status: 'Active' },
              { year: 2021, status: 'Inactive' },
            ],
          },
        },
      ]);

      const csv = await csvService.generateCsv('nested-session');

      expect(csv).toContain('history - year,2020,2021');
      expect(csv).toContain('history - status,Active,Inactive');
    });
  });
});