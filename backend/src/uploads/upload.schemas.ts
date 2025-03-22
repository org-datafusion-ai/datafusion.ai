import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UploadDocument = HydratedDocument<Upload>;

@Schema() 
export class Upload {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: Buffer }) 
  content: Buffer;

  @Prop({ type: String }) 
  contentInStr: string;

  @Prop({ type: Date, default: Date.now })
  uploadedAt: Date;

  @Prop({ type: Object }) 
  processedData: Record<string, any>;

  @Prop({ type: String, required: true })
  uploadedBy: string;

  @Prop({ type: Boolean, default: false })  
  oieLibrary: boolean; 
}

export const UploadSchema = SchemaFactory.createForClass(Upload);


