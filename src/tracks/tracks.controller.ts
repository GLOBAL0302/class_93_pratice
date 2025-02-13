import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Model } from 'mongoose';
import { CreateTrackDto } from './create-track.dto';
import { Album, AlbumDocument } from '../schemas/album.schema';

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
    console.log(album);
    return album;
  }

  @Delete(':trackId')
  async deleteOne(@Param('trackId') trackId: string) {
    const track = await this.trackModel.deleteOne({ _id: trackId });
    if (!track) throw new NotFoundException(`Album with id ${trackId} not found`);
    return { message: `Track with id ${trackId} deleted successfully`, track };
  }
}
