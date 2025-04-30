import { Injectable } from '@nestjs/common';
import { UploadService } from '../uploads/upload.service';

@Injectable()
export class CsvService {
  constructor(private readonly uploadService: UploadService) {}

  async generateCsv(): Promise<string> {
    const uploads = await this.uploadService.getAllUploads();
    const processedDataList = uploads.map(upload => upload.processedData || {});

    const rows: string[] = [];

    processedDataList.forEach((data, index) => {
      rows.push(`Record ${index + 1}`);
      rows.push(...this.objectToVerticalRows(data));
      rows.push(''); // blank row between records
    });

    return rows.join('\n');
  }
  
  /*
  To handle values that contain a ',' in them, because this would usually signify going into a new column.
  */ 
  private escapeCsv(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      value = value.replace(/"/g, '""');
      return `"${value}"`;
    }
    return value;
  }

  private objectToVerticalRows(obj: any, parentKey: string = ''): string[] {
    const rows: string[] = [];
  
    for (const key in obj) {
      const value = obj[key];
      const label = key; // use raw key as-is
  
      // If the value is an array, handle it differently
      if (Array.isArray(value)) {
        // If the array has only one object, treat it as a single object
        if (value.length === 1 && typeof value[0] === 'object' && value[0] !== null) {
          rows.push('');
          rows.push(...this.objectToVerticalRows(value[0], label));
        // If the value is an array of objects, treat it as a list
        } else {
          // Checking if the label is the same as the parent key
          // If it isn't, push the label to the rows
          if (label !== parentKey) {
            rows.push('');
            rows.push(this.escapeCsv(label));
          }
          
          value.forEach((item, index) => {
            // If the item is an object, treat it as a nested object
            if (typeof item === 'object' && item !== null) {
              const nestedRows = this.objectToVerticalRows(item, label);
              rows.push(...nestedRows, '');
            } else {
              rows.push(`${this.escapeCsv(label)},${this.escapeCsv(String(item))}`);
            }
          });
        }
      // If the value is a nested object (but not an array)
      } else if (typeof value === 'object' && value !== null) {
        if (label !== parentKey) {
          rows.push(this.escapeCsv(label));
        }
        const nestedRows = this.objectToVerticalRows(value, label);
        rows.push(...nestedRows);
      } else {
        rows.push(`${this.escapeCsv(label)},${this.escapeCsv(String(value))}`);
      }
    }
    return rows;
  }
}