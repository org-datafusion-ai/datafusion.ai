import { Controller, Get } from '@nestjs/common';
import { CsvService } from './csv.service';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Get('/generate')
  async generateCsv() {
    const csv = await this.csvService.generateCsv();
    return {
      message: 'CSV generated successfully',
      csvData: csv,
    };
  }
}