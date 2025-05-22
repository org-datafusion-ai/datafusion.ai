import { Controller, Get, Req, Res } from '@nestjs/common';
import { CsvService } from './csv.service';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('api/csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) { }

  @Get('preview')
  @ApiOperation({ summary: 'Generate the CSV format using the files uploaded in this session' })
  @ApiResponse({ status: 200, description: 'The CSV format has been generated successfully.' })
  async previewCsv(@Req() req: Request): Promise<string> {
    const sessionToken = req.cookies['session_token'];
    return this.csvService.generateCsv(sessionToken);
  }

  @Get('generate')
  @ApiOperation({ summary: 'Generate the CSV format using the files uploaded in this session, and prompt the browser to download it' })
  @ApiResponse({ status: 200, description: 'The CSV format has been generated successfully and the browser was prompted to download.' })
  async generateCsvDownload(@Req() req: Request, @Res() res: Response) {
    try {
      const sessionToken = req.cookies['session_token'];
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