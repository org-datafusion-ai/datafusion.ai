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

  /**
 * Converts a camelCase or dot.notation or snake_case key to a readable label.
 * Examples:
 *   "partnerName" => "Partner Name"
 *   "partner.name" => "Partner Name"
 *   "partner_name" => "Partner Name"
 */
private toLabel(key: string): string {
  return key
    .replace(/[_\.]/g, ' ') // Replace underscores and dots with spaces
    .replace(/\[(\d+)\]/g, '') // Remove array index markers like [0]
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before camelCase capitals
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
}

private escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    // Escape inner double quotes
    value = value.replace(/"/g, '""');
    // Wrap in double quotes
    return `"${value}"`;
  }
  return value;
}

  private objectToVerticalRows(obj: any, parentKey: string = ''): string[] {
    const rows: string[] = [];
  
    for (const key in obj) {
      const value = obj[key];
      const label = this.toLabel(key);
  
      if (Array.isArray(value)) {
        if (value.length === 1 && typeof value[0] === 'object' && value[0] !== null) {
          // Single item array — print fields directly without repeating label
          rows.push(''); // blank line before array
          rows.push(...this.objectToVerticalRows(value[0], label));
        } else {
          rows.push(''); // blank line before array
          rows.push(label); // Section header for multiple items
  
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              const nestedRows = this.objectToVerticalRows(item);
              rows.push(...nestedRows, ''); // Blank line between array items
            } else {
              rows.push(`${label},${item}`);
            }
          });
        }
      } else if (typeof value === 'object' && value !== null) {
        rows.push(label); // Section header
        const nestedRows = this.objectToVerticalRows(value);
        rows.push(...nestedRows);
      } else {
        rows.push(`${label},${value}`);
      }
    }
  
    return rows;
  }  
}