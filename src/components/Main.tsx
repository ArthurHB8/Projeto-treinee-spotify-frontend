import { Route, Routes } from "react-router-dom";

import Library from "./Library";
import SongPanel from "./SongPanel";
import Content from "./Content";
import AlbumPage from "../pages/AlbumPage";
import ArtistPage from "../pages/ArtistPage";
import PlaylistPage from "../pages/PlaylistPage";
import ProfilePage from "../pages/ProfilePage";

export default function Main() {
  return (
    <div className="flex h-full min-h-0 w-full gap-2 bg-black px-1">
      <Library />
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
        <Route path="/album/:id" element={<AlbumPage />} />
        <Route path="/playlist/:id" element={<PlaylistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <SongPanel />
    </div>
  );
}
