import { Route, Routes } from "react-router-dom";

import Library from "./Library";
import SongPanel from "./SongPanel";
import Content from "./Content";
import AlbumPage from "../pages/AlbumPage";
import ArtistPage from "../pages/ArtistPage";
import PlaylistPage from "../pages/PlaylistPage";

export default function Main() {
  return (
    <div className="mt-[63px] flex h-screen w-full gap-2 bg-black px-1">
      <Library />
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
        <Route path="/album/:id" element={<AlbumPage />} />
        <Route path="/playlist/:id" element={<PlaylistPage />} />
      </Routes>
      <SongPanel />
    </div>
  );
}
