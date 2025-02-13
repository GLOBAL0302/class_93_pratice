import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsController } from './artists/artists.controller';
import { AlbumsController } from './albums/albums.controller';
import { TracksController } from './tracks/tracks.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Artist, ArtistSchema} from "./schemas/artist.schema";
import {Album, AlbumSchema} from "./schemas/album.schema";

@Module({
  imports: [
      MongooseModule.forRoot("mongodb://localhost/spotify"),
      MongooseModule.forFeature([
          {name:Artist.name, schema: ArtistSchema},
          {name:Album.name, schema: AlbumSchema},
      ])
  ],
  controllers: [AppController, ArtistsController, AlbumsController, TracksController],
  providers: [AppService],
})
export class AppModule {}
