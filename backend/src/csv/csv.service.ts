import { Injectable } from '@nestjs/common';
import { UploadService } from '../uploads/upload.service';

@Injectable()
export class CsvService {
  constructor(private readonly uploadService: UploadService) {}

  async generateCsv(): Promise<string> {
    const uploads = await this.uploadService.getAllUploads();
    const processedDataList = uploads.map(upload => upload.processedData || {});

    // Step 1: Flatten each processedData object
    const flattenedDataList = processedDataList.map(data => this.flattenObject(data));

    // Step 2: Collect all unique keys (will be the vertical headers)
    const allKeys = Array.from(
      new Set(flattenedDataList.flatMap(obj => Object.keys(obj)))
    );

    // Step 3: Build vertical CSV: first column is key, rest are values from each upload
    const rows: string[] = [];

    allKeys.forEach(key => {
      const row = [key];
      flattenedDataList.forEach(data => {
        const value = data[key];
        row.push(value !== undefined && value !== null ? `"${value}"` : '');
      });
      rows.push(row.join(','));
    });

    return rows.join('\n');
  }

  /**
   * Recursively flattens an object. Nested keys are represented as "parent.child" or "array[index].child".
   */
  private flattenObject(
    obj: any,
    parentKey: string = ''
  ): Record<string, string> {
    let result: Record<string, string> = {};

    for (const key in obj) {
      const value = obj[key];
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            const nested = this.flattenObject(item, `${fullKey}[${index}]`);
            result = { ...result, ...nested };
          } else {
            result[`${fullKey}[${index}]`] = item;
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        const nested = this.flattenObject(value, fullKey);
        result = { ...result, ...nested };
      } else {
        result[fullKey] = String(value);
      }
    }

    return result;
  }
}