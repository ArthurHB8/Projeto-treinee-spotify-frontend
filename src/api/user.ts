import { api } from "./client";
import type { AlbumNoMusics, Artist, Music, PlaylistNoMusic } from "./types";

export const getUserPlaylists = () => api.get<PlaylistNoMusic[]>("/user/playlists");

export const getUserRecentArtists = () => api.get<Artist[]>("/user/recentArtists");

export const getUserMostPlayedArtists = () => api.get<Artist[]>("/user/mostPlayedArtists");

export const getUserRecentMusics = () => api.get<Music[]>("/user/recentMusics");

export const getUserMostPlayedMusics = () => api.get<Music[]>("/user/mostPlayedMusics");

export const getUserRecentAlbums = () => api.get<AlbumNoMusics[]>("/user/recentAlbums");

export const getUserFollowers = () => api.get<string[]>("/user/followers");
