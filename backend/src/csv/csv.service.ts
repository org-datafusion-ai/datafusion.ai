import { Injectable } from '@nestjs/common';
import { UploadService } from '../uploads/upload.service';

@Injectable()
export class CsvService {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Generates a CSV string from all processed data in the uploads.
   * @returns A CSV string with all the processed data.
   */
  async generateCsv(): Promise<string> {
    // Step 1: Get all uploads
    const uploads = await this.uploadService.getAllUploads();
    const processedData = uploads.map(upload => upload.processedData);

    // Step 2: Extract headers (keys from all processed data)
    const allHeaders = this.getAllHeaders(processedData);

    // Step 3: Format the data into CSV format
    return this.formatDataToCSV(processedData, allHeaders);
  }

  /**
   * Extracts all unique headers (keys) from processed data.
   * @param processedData - Array of processed data objects
   * @returns Array of unique header keys
   */
  private getAllHeaders(processedData: any[]): string[] {
    const allHeaders = new Set<string>();

    processedData.forEach(data => {
      Object.keys(data).forEach(header => allHeaders.add(header));
    });

    return Array.from(allHeaders);
  }

  /**
   * Converts the processed data to CSV format.
   * @param processedData - Array of processed data objects
   * @param allHeaders - Array of all unique headers
   * @returns CSV string
   */
  private formatDataToCSV(processedData: any[], allHeaders: string[]): string {
    const rows: string[] = [];

    // 1. Add headers row
    const headerRow = allHeaders.join(',');
    rows.push(headerRow);

    // 2. Add rows for each processed data
    processedData.forEach(data => {
      const row = allHeaders
        .map(header => (data[header] ? `"${data[header]}"` : ''))
        .join(',');
      rows.push(row);
    });

    return rows.join('\n');
  }
}
