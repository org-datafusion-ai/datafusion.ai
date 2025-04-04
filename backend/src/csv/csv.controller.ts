import { Controller, Get, Res } from '@nestjs/common';
import { CsvService } from './csv.service';
import { Response } from 'express'; // Import Response from Express for setting headers

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Get('generate')
  async generateCSV(@Res() res: Response) {
    try {
      // Step 1: Get the CSV content
      const csvString = await this.csvService.generateCsv();

      // Step 2: Set headers to prompt download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="generated.csv"');

      // Step 3: Send the CSV data as the response
      res.status(200).send(csvString);
    } catch (error) {
      console.error('Error generating CSV:', error);
      throw error;
    }
  }
}