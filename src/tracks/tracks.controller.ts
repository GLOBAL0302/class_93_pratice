import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Model } from 'mongoose';
import { CreateTrackDto } from './create-track.dto';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { AuthGuard } from '@nestjs/passport';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import {Request} from 'express';
import { IUserDocument, User } from '../schemas/user.schema';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,

    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getAll(@Query('albumId') albumId: string) {
    const filter = albumId ? { album: albumId } : {};
    return this.trackModel.find(filter);
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  async create(@Body() trackDto: CreateTrackDto) {
    const album = await this.albumModel.findById(trackDto.album);
    if (!album) throw new NotFoundException(`Album with id ${album.id} not found`);

    const newTrack = new this.trackModel({
      album: trackDto.album,
      title: trackDto.title,
      duration: trackDto.duration,
      isPublished: trackDto.isPublished,
      track_number: trackDto.track_number,
    });

    const track = await newTrack.save();
    return track;
  }


  @UseGuards(TokenAuthGuard)
  @Delete(':trackId')
  async deleteOne(@Param('trackId') trackId: string, @Req() req:Request<{user:User}>)
  {
    const user = req.user as IUserDocument;
    if(user.role === "admin"){
      const track = await this.trackModel.deleteOne({ _id: trackId });
      if (!track) throw new NotFoundException(`Album with id ${trackId} not found`);
      return { message: `Track with id ${trackId} deleted successfully`, track };
    }
  }
}
