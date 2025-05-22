import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import * as path from 'path';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';



@Controller('api/uploads')
@ApiTags('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filepond: {
          type: 'string',
          format: 'binary',
          description: 'One or more files to be uploaded. Accepts PDF, DOCX, XLSX, CSV, and TXT formats. Maximum of 6 files per request. Files are processed and stored for AI extraction and session-based tracking. This is also where the AI processes the files',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully.' })
  @UseInterceptors(
    FilesInterceptor('filepond', 6, {
      fileFilter: (req, file, callback) => {

        const fileExtension = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.pdf', '.doc', '.docx', '.xlsx', '.txt', '.csv', '.xls'];

        if (!allowedExtensions.includes(fileExtension)) {
          return callback(
            new Error(
              'Unsupported file type. Please select only word, excel, pdf, txt file.',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFiles() files: Express.Multer.File[], @Req() req: Request,) {
    const sessionToken = req.cookies['session_token'];

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const result = await this.uploadService.createUpload(
          file,
          sessionToken,
          fileExtension,
        );
        return {
          filename: file.originalname,
          contentInStr: result.contentInStr,
        };
      }),
    );
    return {
      message: 'File uploaded successfully',
      contentInStr: uploadResults,
    };
  }


  @Get()
  @ApiOperation({ summary: 'Get all uploaded records' })
  @ApiResponse({ status: 200, description: 'Successfully returns all uploaded records.' })
  async getAllUploads() {
    return this.uploadService.getAllUploads();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific upload by ID' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the upload to retrieve.' })
  @ApiResponse({ status: 200, description: 'Successfully returns the upload by ID.' })
  async getUploadById(@Param('id') id: string) {
    return this.uploadService.getUploadById(id);
  }

  @Put(':id/updateProcessedData')
  @ApiOperation({ summary: 'Update processedData field for an upload by ID.' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the upload to update.' })
  @ApiResponse({ status: 200, description: 'Successfully updates the processedData field for the upload of the given ID.' })
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


  @Delete('delete')
  @ApiOperation({ summary: 'Delete all uploads in a session by its sessionToken' })
  @ApiParam({ name: 'sessionToken', required: true, description: 'The session token of the session where the files were uploaded.' })
  @ApiResponse({ status: 200, description: 'Uploads for this session were deleted successfully.' })
  async deleteUploadsBySession(@Param('sessionToken') sessionToken: string) {
    await this.uploadService.deleteUploadsBySession(sessionToken);
    return { message: 'Uploads for this session deleted successfully' };
  }
}
