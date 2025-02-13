import {
    Body,
    Controller, Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Artist, ArtistDocument} from "../schemas/artist.schema";
import {Album, AlbumDocument} from "../schemas/album.schema";
import {Model} from "mongoose";
import {FileInterceptor} from "@nestjs/platform-express";
import {CreateAlbumDto} from "./create-album-dto";
import {CreateArtistDto} from "../artists/create-artist.dto";


@Controller('albums')
export class AlbumsController {
    constructor(
        @InjectModel(Artist.name)
        private artistModel:Model<ArtistDocument>,

        @InjectModel(Album.name)
        private albumModel: Model<AlbumDocument>,
    ) {
    }

    @Get()
    async getAll(
        @Query("artistId") artistId:string
    ) {
        const filter = artistId ? {artist:artistId} : {}
        return  this.albumModel.find(filter)
    }

    @Get(':albumId')
    async getOne(
        @Param('albumId') albumId:string
    ){
        console.log(albumId);
        const album = await this.albumModel.findOne({_id:albumId})
        if(!album) throw new NotFoundException(`Album with id ${albumId} not found`)
        return album
    }


    @Post()
    @UseInterceptors(
        FileInterceptor('image', {dest:'./public/uploads/artist'})
    )

    async create(
        @UploadedFile() file:Express.Multer.File,
        @Body() albumDto:CreateAlbumDto
    ){
        const artist = await this.artistModel.findById(albumDto.artist)
        if(!artist) throw new NotFoundException('Artist with such Id not Found');
        const newAlbum = new this.albumModel({
            artist:albumDto.artist,
            title:albumDto.title,
            isPublished:albumDto.isPublished,
            create_at:albumDto.create_at,
            image:file && file.filename ? '/uploads/albums/' + file.filename : null
        })

        const album = await newAlbum.save()
        return album
    }

    @Delete(':albumId')
    async deleteAlbum(@Param('albumId') albumId:string){
        const album = await this.albumModel.deleteOne({_id:albumId})
        if(!album) throw new NotFoundException(`Album with id ${albumId} not found`);
        return {message: 'album deleted successfully', album};
    }

}
