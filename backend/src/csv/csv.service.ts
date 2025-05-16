import { Injectable } from '@nestjs/common';
import { UploadService } from '../uploads/upload.service';

@Injectable()
export class CsvService {
  constructor(private readonly uploadService: UploadService) {}

  async generateCsv(sessionToken: string): Promise<string> {
    const uploads = await this.uploadService.getUploadBySession(sessionToken);
    const processedDataList = uploads.map(u => u.processedData || {});
  
    const headerMap: Map<string, string[]> = new Map(); // key → array of values
  
    // Flatten each upload and collect values
    for (const data of processedDataList) {
      for (const key of Object.keys(data)) {
        const value = data[key];

        if (Array.isArray(value) && value.every(item => typeof item === 'object')) {
          // Array of objects
          const subFields = new Set<string>();
          value.forEach(obj => {
            if (typeof obj === 'object' && obj !== null) {
              Object.keys(obj).forEach(subKey => subFields.add(subKey));
            }
          });

          subFields.forEach(subKey => {
            const header = `${key} - ${subKey}`;
            const existing = headerMap.get(header) || [];
            const subValues = value.map(obj => String(obj?.[subKey] ?? ''));
            headerMap.set(header, [...existing, ...subValues]);
          });

        } else if (typeof value === 'object' && value !== null) {
          // Single nested object
          for (const subKey in value) {
            const header = `${key} - ${subKey}`;
            const existing = headerMap.get(header) || [];
            headerMap.set(header, [...existing, String(value[subKey])]);
          }

        } else if (Array.isArray(value)) {
          // Array of primitives
          const existing = headerMap.get(key) || [];
          const rawValues = value.map(v => String(v));
          headerMap.set(key, [...existing, ...rawValues]);

        } else {
          // Primitive
          const existing = headerMap.get(key) || [];
          headerMap.set(key, [...existing, String(value)]);
        }
      }
    }

    // Build rows: one per header with all its values
    const rows: string[][] = [];
    for (const [header, values] of headerMap.entries()) {
      rows.push([header, ...values]);
    }

    return rows.map(row => row.join(',')).join('\n');
  }
}
