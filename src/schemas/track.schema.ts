import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Album } from './album.schema';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
  })
  album: Album;

  @Prop()
  title: string;

  @Prop()
  track_number: number;

  @Prop()
  duration: string;

  @Prop()
  isPublished: boolean;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
