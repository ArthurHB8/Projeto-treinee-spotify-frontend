export type Music = {
  id: string;
  title: string;
  artistId: string;
  albumId: string;
  playlistsId: string[];
  duration: number;
  releaseDate: string;
  timesListen: number;
  explicit: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type Artist = {
  id: string;
  name: string;
  listeners: number;
  about: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type Album = {
  id: string;
  title: string;
  year: string;
  artistId: string;
  artistName: string;
  musics: Music[];
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type AlbumNoMusics = Omit<Album, "musics">;

export type Playlist = {
  id: string;
  name: string;
  description: string;
  musicQtd: number;
  duration: number;
  musics: Music[];
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type PlaylistNoMusic = Omit<Playlist, "musics">;

export type CreatePlaylistPayload = {
  name: string;
  description: string;
};

export type PutPlaylistPayload = {
  name: string;
  description: string;
};
