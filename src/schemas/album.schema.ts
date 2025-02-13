import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {SchemaTypes} from "mongoose";
import {Artist} from "./artist.schema";

export type AlbumDocument = Album & Document;

@Schema()
export class Album{
    @Prop({
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Artist',
        required:true,
    })
    artist:Artist;

    @Prop({required: true})
    title:string

    @Prop({default:false})
    isPublished:boolean

    @Prop( {required: true})
    create_at:number

    @Prop({default:null, required:true})
    image:string
}

export const AlbumSchema = SchemaFactory.createForClass(Album)