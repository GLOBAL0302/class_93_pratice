import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query, Req,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create-album-dto';
import { AuthGuard } from '@nestjs/passport';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { IUserDocument, User } from '../schemas/user.schema';
import {Request} from 'express';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,

    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getAll(@Query('artistId') artistId: string) {
    const filter = artistId ? { artist: artistId } : {};
    return this.albumModel.find(filter);
  }

  @Get(':albumId')
  async getOne(@Param('albumId') albumId: string) {
    const album = await this.albumModel.findOne({ _id: albumId });
    if (!album) throw new NotFoundException(`Album with id ${albumId} not found`);
    return album;
  }



  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/uploads/albums' }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() albumDto: CreateAlbumDto) {
    const artist = await this.artistModel.findById(albumDto.artist);
    if (!artist) throw new NotFoundException('Artist with such Id not Found');
    const newAlbum = new this.albumModel({
      artist: albumDto.artist,
      title: albumDto.title,
      isPublished: albumDto.isPublished,
      create_at: albumDto.create_at,
      image: file && file.filename ? '/uploads/albums/' + file.filename : null,
    });

    const album = await newAlbum.save();
    return album;
  }

  @UseGuards(TokenAuthGuard)
  @Delete(':albumId')
  async deleteAlbum(@Param('albumId') albumId: string ,@Req() req:Request<{user:User}>) {

    const user = req.user as IUserDocument;
    if(user.role === "admin"){
      const album = await this.albumModel.deleteOne({ _id: albumId });
      if (!album) throw new NotFoundException(`Album with id ${albumId} not found`);
      return { message: 'album deleted successfully', album };
    }
  }
}
