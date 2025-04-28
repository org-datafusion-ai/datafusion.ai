/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Upload, UploadDocument } from './upload.schemas';
import * as mammoth from 'mammoth';
// import * as pdfParse from 'pdf-parse';
import * as xlsx from 'xlsx';
import pdfParse from 'pdf-parse';
import { UploadController } from './upload.controller';
import { AIService } from '../ai/ai.service';


@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Upload.name) private readonly uploadModel: Model<UploadDocument>,
    private readonly aiService: AIService,
  ) { }

  // Create upload record
  async createUpload(file: Express.Multer.File, userId: string, fileExtension: string): Promise<UploadDocument> {

  // 1. transform the content to string
    let fileContent = '';
      // Handle .txt files.
  if (fileExtension === '.txt') {
    fileContent = file.buffer.toString('utf8');

  // Handle .pdf files.
  } else if (fileExtension === '.pdf') {
    const pdfData = await pdfParse(file.buffer); // Use pdf-parse to extract text
    fileContent = pdfData.text;

  // Handle .docx or .doc files (Word).
  } else if (fileExtension === '.docx' || fileExtension === '.doc') {
    const wordData = await mammoth.extractRawText({ buffer: file.buffer }); // Use mammoth for Word files
    fileContent = wordData.value;

  // Handle .xlsx files (Excel).
  } else if (fileExtension === '.xlsx') {
    // Use xlsx library to parse Excel file
    const workbook = xlsx.read(file.buffer, { type: 'buffer' }); // Parse from buffer
    // Initialize an array to store the content from all worksheets
    const allSheetData: string[] = [];
  // Loop through each sheet in the workbook
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName]; // Get the worksheet by name
      const sheetData = xlsx.utils.sheet_to_csv(worksheet); // Convert the sheet to CSV format
      allSheetData.push(`Sheet: ${sheetName}\n${sheetData}`); // Append sheet name and content
    });
    // Combine data from all sheets into one string
    fileContent = allSheetData.join('\n\n'); // Separate sheets with double newlines
  } else {
    // If the file type is unsupported, handle it gracefully
    throw new Error('Unsupported file type. Please upload a valid file.');
  }
    // remove unnessary new line.
    fileContent = this.removeExtraNewLines(fileContent);
    fileContent = this.removeDuplicates(fileContent);
    // 2. extract the info
    const extractedInfo = await this.aiService.extractInformation(fileContent);
    // 3. save infor into DB
    const newUpload = new this.uploadModel({
      id: this.generateUniqueId(file.originalname),
      title: file.originalname,
      fileExtension: fileExtension,
      type: file.mimetype,
      content: file.buffer,
      contentInStr: fileContent,
      processedData: extractedInfo,
      uploadedBy: userId, //TODO: Add the UserName by the frontend login ID.
    });

      // **Release file.buffer**
    file.buffer.fill(0); // use 0 replace the content in buffer 
    file.buffer = null as any; // release memory
    
    // console.log("This is the content:" + fileContent);
    console.log("*****************************************");

    console.log('Extracted Info:', extractedInfo);
  
    return newUpload.save(); // save the upload object into DB.
  }

  // Read: 獲取所有上傳記錄
  async getAllUploads(): Promise<UploadDocument[]> {
    return this.uploadModel.find().populate('uploadedBy').exec();
    // return this.uploadModel.find().select('-content').populate('uploadedBy').exec(); // 可選：populate用來填充上傳者信息
  }

  // Read: 根據ID獲取單個上傳記錄
  async getUploadById(uploadId: string): Promise<UploadDocument> {
    const upload = await this.uploadModel.findById(uploadId).populate('uploadedBy').exec();
    if (!upload) {
      throw new NotFoundException(`Upload with ID "${uploadId}" not found`);
    }
    return upload;
  }


  // Update: 更新某條記錄的處理後數據 (processedData)
  async updateProcessedData(uploadId: string, processedData: Record<string, any>): Promise<UploadDocument> {
    const upload = await this.getUploadById(uploadId); // 確保該記錄存在
    upload.processedData = processedData;
    return upload.save(); // 儲存更新後的數據
  }

  // Delete: 刪除上傳記錄
  async deleteUpload(uploadId: string): Promise<void> {
    const result = await this.uploadModel.findByIdAndDelete(uploadId).exec();
    if (!result) {
      throw new NotFoundException(`Upload with ID "${uploadId}" not found`);
    }
  }

  // Generate id for the upload reocrd object
  private generateUniqueId(file: string): string {
    const uploadDate = new Date().toISOString().replace(/[-T:.Z]/g, ''); // 格式化日期，例如 "20250312112345"
    const sanitizedFileName = file.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, ''); // 移除非法字符
    return `${uploadDate}_${sanitizedFileName}`;
    // private generateUniqueId(): string {
    // return `${Date.now()}-${Upload.name}`;
    // return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  // delete unessacery new line char (/n) .
  public removeExtraNewLines(content: string): string {
    // 匹配連續的兩個或更多換行符，並替換為單一換行符
    return content.replace(/(\r?\n){2,}/g, '\n');
    
    // (/\n{2,}/g, '\n');
  }

  public removeDuplicates(content: string): string {
    const lines = content.split('\n'); // 將內容按行分割
    const seen = new Set<string>(); // 用於儲存已出現的行
    const uniqueLines = lines.filter(line => {
      if (seen.has(line)) {
        return false; // 如果已出現過，過濾掉
      }
      seen.add(line); // 添加到 Set 中
      return true; // 保留未出現的行
    });
    return uniqueLines.join('\n'); // 將處理後的行重新組合
  }    
}
