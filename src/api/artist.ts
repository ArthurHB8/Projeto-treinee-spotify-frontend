import { api } from "./client";
import type { Album, Artist, Music } from "./types";

export const getArtistById = (artistId: string) => api.get<Artist>(`/artist/${artistId}`);

export const setArtistImage = (artistId: string, file: File) =>
  api.upload<Artist>(`/artist/${artistId}/image`, file);

export const getPopularMusicsByArtistId = (artistId: string) =>
  api.get<Music[]>(`/artist/${artistId}/popularMusics`);

export const getAlbumsByArtistId = (artistId: string) =>
  api.get<Album[]>(`/artist/${artistId}/albums`);
