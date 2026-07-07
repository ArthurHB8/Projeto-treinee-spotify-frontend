import { api } from "./client";
import type { Album, Music } from "./types";

export const getAlbumById = (albumId: string) => api.get<Album>(`/album/${albumId}`);

export const getMusicsByAlbumId = (albumId: string) =>
  api.get<Music[]>(`/album/${albumId}/musics`);
