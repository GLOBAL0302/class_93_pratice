import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { Request } from 'express';
import { IUserDocument, User } from '../schemas/user.schema';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @UseGuards(TokenAuthGuard)
  @Get()
  getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.artistModel.findById(id);
  }

  @UseGuards(TokenAuthGuard)
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

  @UseGuards(TokenAuthGuard)
  @Delete(':id')
  async deleteOne(@Param('id') id: string, @Req() req: Request<{ user: User }>) {
    const user = req.user as IUserDocument;
    if (user.role === 'admin') {
      const artist = await this.artistModel.findOneAndDelete({ _id: id });
      if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
      return { message: 'Artists deleted successfully', artist };
    }
  }
}
