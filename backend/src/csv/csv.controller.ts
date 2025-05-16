import { Controller, Get, Req, Res } from '@nestjs/common';
import { CsvService } from './csv.service';
import { Request, Response } from 'express';

@Controller('api/csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) { }

  @Get('preview')
  async previewCsv(@Req() req: Request): Promise<string> {
    const sessionToken = req.cookies['session_token'];
    return this.csvService.generateCsv(sessionToken);
  }

  @Get('generate')
  async generateCsvDownload(@Req() req: Request, @Res() res: Response) {
    try {
      const sessionToken = req.cookies['session_token'];
      console.log('Download session token:', sessionToken);
      const csvString = await this.csvService.generateCsv(sessionToken);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="generated.csv"');
      res.status(200).send(csvString);
    } catch (error) {
      console.error('Error generating CSV:', error);
      res.status(500).send('Failed to generate CSV');
    }
  }
}