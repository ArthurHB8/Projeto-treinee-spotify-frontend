import { api } from "./client";
import type { Album, Music } from "./types";

export const getPopularMusicsByArtistId = (artistId: string) =>
  api.get<Music[]>(`/artist/${artistId}/popularMusics`);

export const getAlbumsByArtistId = (artistId: string) =>
  api.get<Album[]>(`/artist/${artistId}/albums`);
