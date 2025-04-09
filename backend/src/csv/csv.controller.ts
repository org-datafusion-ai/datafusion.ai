import { Controller, Get, Res } from '@nestjs/common';
import { CsvService } from './csv.service';
import { Response } from 'express';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Get('generate')
  async generateCSV(@Res() res: Response) {
    try {
      const csvString = await this.csvService.generateCsv();

      // Set headers to prompt file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="generated.csv"');

      // Send the CSV content
      res.status(200).send(csvString);
    } catch (error) {
      console.error('Error generating CSV:', error);
      res.status(500).send('Failed to generate CSV');
    }
  }
}