import { Artist } from '../schemas/artist.schema';

export class CreateAlbumDto {
  artist: Artist;
  title: string;
  isPublished: boolean;
  create_at: number;
}
