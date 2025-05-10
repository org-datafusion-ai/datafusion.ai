import { Controller, Get, Req, Res } from '@nestjs/common';
import { CsvService } from './csv.service';
import { Request, Response } from 'express';

@Controller('api/csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  // 1. Serve CSV as a string (for frontend preview)
  @Get('preview')
  async previewCsv(@Req() req: Request): Promise<string> {
    const sessionToken = req.cookies['session_token'];
    return this.csvService.generateCsv(sessionToken);
  }

  // 2. Prompt browser to download the CSV
  @Get('generate')
  async generateCsvDownload(@Req() req: Request, @Res() res: Response) {
    try {
      const sessionToken = req.cookies['session_token'];
      const csvString = await this.csvService.generateCsv(sessionToken);

      // Set headers to prompt file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="generated.csv"');
      res.status(200).send(csvString);
    } catch (error) {
      console.error('Error generating CSV:', error);
      res.status(500).send('Failed to generate CSV');
    }
  }
}