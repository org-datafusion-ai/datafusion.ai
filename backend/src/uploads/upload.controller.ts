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
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filepond: {
          type: 'string',
          format: 'binary',
          description: 'One or more files to be uploaded. Accepts PDF, DOCX, XLSX, CSV, and TXT formats. Maximum of 6 files per request. Files are processed and stored for AI extraction and session-based tracking.',
        },
      },
    },
  })

  @ApiResponse({ status: 201, description: 'Files uploaded successfully.' })
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
  @ApiResponse({ status: 200, description: 'Returns all upload records.' })
  async getAllUploads() {
    return this.uploadService.getAllUploads();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific upload by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Returns upload by ID.' })
  async getUploadById(@Param('id') id: string) {
    return this.uploadService.getUploadById(id);
  }

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


  @Delete('delete')
  @ApiOperation({ summary: 'Delete an upload by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Upload deleted successfully.' })
  async deleteUploadsBySession(@Param('sessionToken') sessionToken: string) {
    await this.uploadService.deleteUploadsBySession(sessionToken);
    return { message: 'Uploads for this session deleted successfully' };
  }
}
