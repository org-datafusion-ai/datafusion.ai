import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Upload, UploadDocument } from './upload.schemas';
import * as mammoth from 'mammoth';
import * as xlsx from 'xlsx';
import pdfParse from 'pdf-parse';
import { UploadController } from './upload.controller';
import { AIService } from '../ai/ai.service'

@Injectable()
export class UploadService {

  constructor(
    @InjectModel(Upload.name)
    private readonly uploadModel: Model<UploadDocument>,
    private readonly aiService: AIService,
  ) { }
  async createUpload(
    file: Express.Multer.File,
    sessionToken: string,
    fileExtension: string,
  ): Promise<UploadDocument> {
    let fileContent = '';

    switch (fileExtension) {
      case '.txt':
        fileContent = file.buffer.toString('utf8');
        break;

      case '.pdf': {
        const pdfData = await pdfParse(file.buffer);
        fileContent = pdfData.text;
        break;
      }

      case '.docx':
      case '.doc': {
        const wordData = await mammoth.extractRawText({ buffer: file.buffer });
        fileContent = wordData.value;
        break;
      }

      case '.xlsx': {
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const allSheetData: string[] = [];

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const sheetData = xlsx.utils.sheet_to_csv(worksheet);
          allSheetData.push(`Sheet: ${sheetName}\n${sheetData}`);
        });

        fileContent = allSheetData.join('\n\n');
        break;
      }

      default:
        throw new Error('Unsupported file type. Please upload a valid file.');
    }

    fileContent = this.removeExtraNewLines(fileContent);
    fileContent = this.removeDuplicates(fileContent);

    const extractedInfo = await this.aiService.extractInformation(fileContent);

    const newUpload = new this.uploadModel({
      id: this.generateUniqueId(file.originalname),
      title: file.originalname,
      fileExtension: fileExtension,
      type: file.mimetype,
      //content: file.buffer,
      contentInStr: fileContent,
      processedData: extractedInfo,
      uploadedBy: sessionToken,
    });

    file.buffer.fill(0); 
    file.buffer = null as any; 

    return newUpload.save();
  }


  async getAllUploads(): Promise<UploadDocument[]> {
    return this.uploadModel.find().populate('uploadedBy').exec();
  }

  async getUploadById(uploadId: string): Promise<UploadDocument> {
    const upload = await this.uploadModel
      .findById(uploadId)
      .populate('uploadedBy')
      .exec();
    if (!upload) {
      throw new NotFoundException(`Upload with ID "${uploadId}" not found`);
    }
    return upload;
  }

  async getUploadBySession(sessionToken: string): Promise<UploadDocument[]> {
    const uploads = await this.uploadModel
      .find({ uploadedBy: sessionToken })
      .exec();

    if (!uploads || uploads.length === 0) {
      throw new NotFoundException(`No uploads found for this session`);
    }

    return uploads;
  }

  async updateProcessedData(
    uploadId: string,
    processedData: Record<string, any>,
  ): Promise<UploadDocument> {
    const upload = await this.getUploadById(uploadId);
    upload.processedData = processedData;
    return upload.save();
  }

  async deleteUpload(uploadId: string): Promise<void> {
    const result = await this.uploadModel.findByIdAndDelete(uploadId).exec();
    if (!result) {
      throw new NotFoundException(`Upload with ID "${uploadId}" not found`);
    }
  }

  private generateUniqueId(file: string): string {
    const uploadDate = new Date().toISOString().replace(/[-T:.Z]/g, '');
    const sanitizedFileName = file
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
    return `${uploadDate}_${sanitizedFileName}`;
  }

  public removeExtraNewLines(content: string): string {
    return content.replace(/(\r?\n){2,}/g, '\n');
  }

  public removeDuplicates(content: string): string {
    const lines = content.split('\n');
    const seen = new Set<string>();
    const uniqueLines = lines.filter((line) => {
      if (seen.has(line)) {
        return false;
      }
      seen.add(line);
      return true;
    });
    return uniqueLines.join('\n');
  }
}
