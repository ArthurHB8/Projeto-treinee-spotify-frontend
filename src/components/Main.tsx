import { DragDropProvider, PointerSensor } from "@dnd-kit/react";
import { PointerActivationConstraints } from "@dnd-kit/dom";
import { Route, Routes, useLocation } from "react-router-dom";

import Library from "./Library";
import SongPanel from "./SongPanel";
import Content from "./Content";
import AlbumPage from "../pages/AlbumPage";
import ArtistPage from "../pages/ArtistPage";
import PlaylistPage from "../pages/PlaylistPage";
import ProfilePage from "../pages/ProfilePage";
import SearchPage from "../pages/SearchPage";

const distancia = [
  PointerSensor.configure({
    activationConstraints: [
      new PointerActivationConstraints.Distance({ value: 8 }),
    ],
  }),
];

export default function Main() {
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  return (
    <DragDropProvider sensors={distancia}>
      <div className="flex h-full min-h-0 w-full gap-2 bg-black px-1">
        <div className={isSearchPage ? "hidden md:block" : undefined}>
          <Library />
        </div>
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/album/:id" element={<AlbumPage />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
        <SongPanel />
      </div>
    </DragDropProvider>
  );
}
