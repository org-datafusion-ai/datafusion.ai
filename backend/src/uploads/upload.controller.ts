import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // ==============================
  //  File Upload Functionality
  // ==============================

  /**
   * Handles file upload and creates a corresponding upload record in the database.
   * - Uses Multer to intercept the uploaded file.
   * - TODO: Integrate with the user schema to dynamically retrieve userId from login.
   *
   * @param file - The uploaded file (handled by Multer).
   * @returns A success message and the created upload record.
   */
  @Post()
  @UseInterceptors(FileInterceptor('filepond')) // Intercept file data using Multer.
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const userId = 'someUserId'; // Placeholder for the user ID (to be replaced later with login integration).
    const upload = await this.uploadService.createUpload(file, userId);
    return { message: 'File uploaded successfully', upload };
  }

  // ==============================
  //  Fetch Records (Read Operations)
  // ==============================

  /**
   * Retrieves all upload records from the database.
   *
   * @returns A list of all upload records.
   */
  @Get()
  async getAllUploads() {
    return this.uploadService.getAllUploads();
  }

  /**
   * Retrieves a specific upload record by its ID.
   *
   * @param id - The unique ID of the upload record.
   * @returns The upload record if found.
   * @throws NotFoundException if the record is not found.
   */
  @Get(':id')
  async getUploadById(@Param('id') id: string) {
    return this.uploadService.getUploadById(id);
  }

  // ==============================
  //  Update Operations
  // ==============================

  /**
   * Updates the `processedData` field for a specific upload record after AI processing.
   *
   * @param id - The unique ID of the upload record.
   * @param processedData - The processed data to update the record with.
   * @returns A success message and the updated upload record.
   * @throws NotFoundException if the record is not found.
   */
  @Put(':id/updateProcessedData')
  async updateProcessedData(
    @Param('id') id: string,
    @Body() processedData: Record<string, any>,
  ) {
    const updatedUpload = await this.uploadService.updateProcessedData(
      id,
      processedData,
    );
    return { message: 'Processed data updated successfully', updatedUpload };
  }

  // ==============================
  //  Deletion Operations
  // ==============================

  /**
   * Deletes a specific upload record from the database.
   *
   * @param id - The unique ID of the upload record to delete.
   * @returns A success message confirming the deletion.
   * @throws NotFoundException if the record is not found.
   */
  @Delete(':id')
  async deleteUpload(@Param('id') id: string) {
    await this.uploadService.deleteUpload(id);
    return { message: 'Upload deleted successfully' };
  }
}
