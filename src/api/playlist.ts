import { api } from "./client";
import type {
  CreatePlaylistPayload,
  Playlist,
  PlaylistNoMusic,
  PutPlaylistPayload,
} from "./types";

export const getPlaylistById = (playlistId: string) =>
  api.get<Playlist>(`/playlist/${playlistId}`);

export const setPlaylistImage = (playlistId: string, file: File) =>
  api.upload<Playlist>(`/playlist/${playlistId}/image`, file);

export const createPlaylist = (payload: CreatePlaylistPayload) =>
  api.post<PlaylistNoMusic>("/playlist", payload);

export const editPlaylistAttributes = (playlistId: string, payload: PutPlaylistPayload) =>
  api.put<PlaylistNoMusic>(`/playlist/${playlistId}/attributes`, payload);

export const addMusicToPlaylist = (playlistId: string, musicId: string) =>
  api.patch<Playlist>(`/playlist/${playlistId}/${musicId}`);

export const removeMusicFromPlaylist = (playlistId: string, musicId: string) =>
  api.delete<void>(`/playlist/${playlistId}/${musicId}`);

export const deletePlaylist = (playlistId: string) =>
  api.delete<void>(`/playlist/${playlistId}`);
