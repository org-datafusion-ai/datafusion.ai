import { Injectable } from '@nestjs/common';
import { UploadService } from '../uploads/upload.service';
import { UploadDocument } from 'src/uploads/upload.schemas';

@Injectable()
export class CsvService {
  constructor(private readonly uploadService: UploadService) { }

  async generateCsv(sessionToken: string): Promise<string> {
    const result = await this.uploadService.getUploadBySession(sessionToken);

    const uploads = Array.isArray(result) ? result : [result];
    const processedDataList = uploads.map((upload: UploadDocument) => upload?.processedData || {});

    const rows: string[] = [];

    processedDataList.forEach((data, index) => {
      rows.push(`Record ${index + 1}`);
      rows.push(...this.objectToVerticalRows(data));
      rows.push(''); // blank row between records
    });

    return rows.join('\n');
  }

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
      const label = key;


      if (Array.isArray(value)) {

        if (value.length === 1 && typeof value[0] === 'object' && value[0] !== null) {
          rows.push('');
          rows.push(...this.objectToVerticalRows(value[0], label));

        } else {

          if (label !== parentKey) {
            rows.push('');
            rows.push(this.escapeCsv(label));
          }

          value.forEach((item, index) => {

            if (typeof item === 'object' && item !== null) {
              const nestedRows = this.objectToVerticalRows(item, label);
              rows.push(...nestedRows, '');
            } else {
              rows.push(`${this.escapeCsv(label)},${this.escapeCsv(String(item))}`);
            }
          });
        }

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
    console.log(rows)
    return rows;
  }
}