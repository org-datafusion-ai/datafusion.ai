import { Injectable } from '@nestjs/common';
import { UploadService } from '../uploads/upload.service';

@Injectable()
export class CsvService {
  constructor(private readonly uploadService: UploadService) {}

  async generateCsv(sessionToken: string): Promise<string> {
    const uploads = await this.uploadService.getUploadBySession(sessionToken);
    const processedDataList = uploads.map(u => u.processedData || {});
  
    const headerMap: Map<string, string[]> = new Map(); // key with an array of values
  
    // For each processedData
    for (const data of processedDataList) {
      // Each key in the particular upload's processedData
      for (const key of Object.keys(data)) {
        const value = data[key];

        // If the key's value pair is an array of objects
        if (Array.isArray(value) && value.every(item => typeof item === 'object')) {
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

          // If the key's value pair is a single nested object
        } else if (typeof value === 'object' && value !== null) {
          for (const subKey in value) {
            const header = `${key} - ${subKey}`;
            const existing = headerMap.get(header) || [];
            headerMap.set(header, [...existing, String(value[subKey])]);
          }

          // If the key's value pair is an array of primitives
        } else if (Array.isArray(value)) {
          const existing = headerMap.get(key) || [];
          const rawValues = value.map(v => String(v));
          headerMap.set(key, [...existing, ...rawValues]);

          // If the key's value pair is primitive
        } else {
          const existing = headerMap.get(key) || [];
          headerMap.set(key, [...existing, String(value)]);
        }
      }
    }

    // Build the rows: one per header with all its values
    const rows: string[][] = [];
    for (const [header, values] of headerMap.entries()) {
      rows.push([header, ...values]);
    }

    return rows.map(row => row.join(',')).join('\n');
  }
}
