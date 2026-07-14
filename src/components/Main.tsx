import { Route, Routes } from "react-router-dom";

import Library from "./Library";
import SongPanel from "./SongPanel";
import Content from "./Content";
import AlbumPage from "../pages/AlbumPage";
import ArtistPage from "../pages/ArtistPage";
import PlaylistPage from "../pages/PlaylistPage";
import albumCover from "../assets/album-cover.png";

export default function Main() {
  return (
    <div className="flex w-full h-screen bg-black gap-2 px-1 mt-[63px]">
      <Library />
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
        <Route path="/album/:id" element={<AlbumPage />} />
        <Route path="/playlist/:id" element={<PlaylistPage />} />
      </Routes>
      <SongPanel titulo="Never Let Go" artista="LINGSHOT" capa={albumCover} />
    </div>
  );
}
