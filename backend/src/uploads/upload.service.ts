import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Upload, UploadDocument } from './upload.schemas';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Upload.name) private readonly uploadModel: Model<UploadDocument>
  ) { }

  // Create: 新增上傳記錄
  async createUpload(file: Express.Multer.File, userId: string): Promise<UploadDocument> {
    const newUpload = new this.uploadModel({
      id: this.generateUniqueId(file.originalname),
      title: file.originalname,
      type: file.mimetype,
      content: file.buffer,
      uploadedBy: userId,
    });
    let fileContent = '';
    if (file.mimetype === 'text/plain') {
      fileContent = file.buffer.toString('utf8'); // 將 buffer 轉換為文字
    }
    console.log("This is the content:" + fileContent);

    return newUpload.save(); // 儲存到資料庫
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
}
