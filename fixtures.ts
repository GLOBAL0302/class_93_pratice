import { Injectable } from '@nestjs/common';

import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';



import { SourceCode } from 'eslint';
import config  from './config';
import { Artist, ArtistDocument } from './src/schemas/artist.schema';
import { Album, AlbumDocument } from './src/schemas/album.schema';
import { Track, TrackDocument } from './src/schemas/track.schema';


@Injectable()
export class fixtures {
  constructor(
    @InjectModel(Artist.name) private readonly artistModel:Model<ArtistDocument>,
    @InjectModel(Album.name) private readonly albumModel:Model<AlbumDocument>,
    @InjectModel(Track.name) private readonly trackModel:Model<TrackDocument>,
  ) {
  }

  async seed(){
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try{
      await db.dropCollection('artists');
      await db.dropCollection('albums');
      await db.dropCollection('tracks');
    }catch(err){
      console.log('Collections did not exist or failed to drop');
    }

    const [linkinPark, skillet, bigBang] = await this.artistModel.create([
      {
        title: 'Linkin Park',
        image: 'fixtures/linkinPng.jpg',
        isPublished: true,
      },
      {
        title: 'Skillet',
        image: 'fixtures/skillet.png',
        isPublished: true,
      },
      {
        title: 'BigBang',
        image: 'fixtures/kpop.JPG',
        isPublished: false,
      },
    ]);

    const [linkinPark_1al, linkinPark_2al, skillet_1al, skillet_2al, bigBang_1al] = await this.albumModel.create([
      {
        title: 'Meteora',
        artist: linkinPark,
        create_at: 2011,
        image: 'fixtures/linkin_1.png',
        isPublished: true,
      },
      {
        title: 'Hybrid Theory',
        artist: linkinPark,
        create_at: 2022,
        image: 'fixtures/linkin_2.jpeg',
        isPublished: true,
      },
      {
        title: 'Comatose',
        artist: skillet,
        create_at: 2020,
        image: 'fixtures/skillet_1.jpg',
        isPublished: true,
      },
      {
        title: 'Collide',
        artist: skillet,
        create_at: 2021,
        image: 'fixtures/skillet_2.jpg',
        isPublished: true,
      },
      {
        title: 'Made Series',
        artist: bigBang,
        create_at: 2021,
        image: 'fixtures/kpop_1.jpg',
        isPublished: false,
      },
    ]);


    await this.trackModel.create([
      {
        title: 'Loser',
        track_number: 2,
        album: bigBang_1al,
        duration: '2:55',
        isPublished: false,
      },

      {
        title: 'Hit the floor',
        track_number: 1,
        album: linkinPark_1al,
        duration: '2:23',
        isPublished: true,
      },
      {
        title: 'tester',
        track_number: 5,
        album: linkinPark_1al,
        duration: '0:00',
        isPublished: true,
      },
    ]);

    console.log('Seeding complete!');
    await db.close();
  }
}

