import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Track, TrackDocument } from '../schemas/track.schema';
import { randomUUID } from 'crypto';
import { User } from '../schemas/user.schema';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Artist.name) private readonly artistModel: Model<Artist>,
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async seed(){

    await this.artistModel.deleteMany({})
    await this.albumModel.deleteMany({})
    await this.trackModel.deleteMany({})
    await this.userModel.deleteMany({})

    const [linkinPark, skillet, bigBang] = await this.artistModel.create(
      {
        title: `Linkin Park`,
        image: 'fixtures/linkinPng.jpg',
        isPublished: true,
      },
      {
        title: 'skillet',
        image: 'fixtures/skillet.png',
        isPublished: true,
      },
      {
        title: 'BigBang',
        image: 'fixtures/kpop.JPG',
        isPublished: false,
      },
    );

    const [linkinPark_1al, linkinPark_2al, skillet_1al, skillet_2al, bigBang_1al] = await this.albumModel.create(
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
    );

    await this.trackModel.create(
      {
        title: 'Loser',
        track_number: 2,
        album: bigBang_1al,
        duration: '2:55',
        isPublished: false,
      },
      {
        title: 'If you',
        track_number: 1,
        album: bigBang_1al,
        duration: '2:24',
        isPublished: false,
      },
      {
        title: 'Bae Bae',
        track_number: 4,
        album: bigBang_1al,
        duration: '2:30',
        isPublished: false,
      },

      {
        title: 'Foreworld',
        track_number: 2,
        album: linkinPark_1al,
        duration: '2:00',
        isPublished: true,
      },
      {
        title: 'Hit the floor',
        track_number: 1,
        album: linkinPark_1al,
        duration: '2:23',
        isPublished: true,
      },
      {
        title: 'Dont Stay',
        track_number: 5,
        album: linkinPark_1al,
        duration: '2:00',
        isPublished: true,
      },
      {
        title: 'Figure 009',
        track_number: 3,
        album: linkinPark_1al,
        duration: '2:35',
        isPublished: true,
      },
      {
        title: 'Faint',
        track_number: 4,
        album: linkinPark_1al,
        duration: '2:35',
        isPublished: true,
      },

      {
        title: 'Papercut',
        track_number: 2,
        album: linkinPark_2al,
        duration: '2:34',
        isPublished: true,
      },
      {
        title: 'With you',
        track_number: 3,
        album: linkinPark_2al,
        duration: '2:45',
        isPublished: true,
      },
      {
        title: 'Crawling',
        track_number: 1,
        album: linkinPark_2al,
        duration: '2:36',
        isPublished: true,
      },
      {
        title: 'By Myself',
        track_number: 5,
        album: linkinPark_2al,
        duration: '2:45',
        isPublished: true,
      },
      {
        title: 'Crawling',
        track_number: 4,
        album: linkinPark_2al,
        duration: '2:23',
        isPublished: true,
      },

      {
        title: 'Yours to Hold',
        track_number: 2,
        album: skillet_1al,
        duration: '3:24',
        isPublished: true,
      },

      {
        title: 'Comatose',
        track_number: 1,
        album: skillet_1al,
        duration: '3:24',
        isPublished: true,
      },
      {
        title: 'Those Nights',
        track_number: 3,
        album: skillet_1al,
        duration: '3:24',
        isPublished: true,
      },

      {
        title: 'The last Night',
        track_number: 4,
        album: skillet_1al,
        duration: '3:54',
        isPublished: true,
      },

      {
        title: 'The older I get',
        track_number: 5,
        album: skillet_1al,
        duration: '3:34',
        isPublished: true,
      },

      {
        title: 'The last Night',
        track_number: 1,
        album: skillet_2al,
        duration: '3:44',
        isPublished: true,
      },
      {
        title: 'My Obsession',
        track_number: 4,
        album: skillet_2al,
        duration: '3:33',
        isPublished: true,
      },
      {
        title: 'Fingermails',
        track_number: 3,
        album: skillet_2al,
        duration: '3:25',
        isPublished: true,
      },
      {
        title: 'Finger mails',
        track_number: 2,
        album: skillet_2al,
        duration: '3:28',
        isPublished: true,
      },
      {
        title: 'Under My Skin',
        track_number: 5,
        album: skillet_2al,
        duration: '3:21',
        isPublished: true,
      },
    );

    await this.userModel.create(
      {
        email: 'kuba',
        password: '321',
        role: 'admin',
        token: randomUUID(),
      },
      {
        email: 'beka',
        password: '123',
        role: 'user',
        token: randomUUID(),
      },
    );
  }
}