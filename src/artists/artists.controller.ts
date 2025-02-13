import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.artistModel.findById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/uploads/artist' }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() artistDto: CreateArtistDto) {
    const newArtist = new this.artistModel({
      title: artistDto.title,
      isPublished: artistDto.isPublished,
      image: file && file.filename ? '/uploads/product/' + file.filename : null,
    });
    const artist = await newArtist.save();
    return artist;
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const artist = await this.artistModel.findOneAndDelete({ _id: id });
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return { message: 'Artists deleted successfully', artist };
  }
}
