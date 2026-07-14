import { api } from "./client";
import type { Album, Music } from "./types";

export const getAlbumById = (albumId: string) => api.get<Album>(`/album/${albumId}`);

export const setAlbumImage = (albumId: string, file: File) =>
  api.upload<Album>(`/album/${albumId}/image`, file);

export const getMusicsByAlbumId = (albumId: string) =>
  api.get<Music[]>(`/album/${albumId}/musics`);
