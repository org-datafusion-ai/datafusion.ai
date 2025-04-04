import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from '../uploads/upload.schemas';
import * as json2csv from 'json2csv';

@Injectable()
export class CsvService {
  constructor(
    @InjectModel(Upload.name) private readonly uploadModel: Model<UploadDocument>,
  ) {}

  async generateCsv(): Promise<string> {
    // Step 1: Retrieve all uploads
    const uploads = await this.uploadModel.find().exec();

    // Step 2: Extract processedData from each upload
    const records = uploads.map(upload => {
      return upload.processedData;
    });

    // Step 3: Convert processedData (JSON) to CSV
    const csv = json2csv.parse(records); // This assumes each processedData is an object

    // Step 4: Return the generated CSV as a string or save it to a file
    return csv;
  }
}