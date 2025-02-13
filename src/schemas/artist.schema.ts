import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


export type ArtistDocument = Artist & Document;

@Schema()
export class Artist{
    @Prop({ required: true })
    title:string

    @Prop({required: true})
    isPublished:boolean

    @Prop({required: true, default:null})
    image:string
}

export const ArtistSchema = SchemaFactory.createForClass(Artist)


