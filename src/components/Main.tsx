import Library from "./Library";
import NavBar from "./NavBar";
import SongPanel from "./SongPanel";
import Content from "./Content";
import albumCover from "../assets/album-cover.png";

export default function Main() {
  return (
    <div className="flex w-full h-screen bg-black gap-2 px-1 mt-[63px]">
      <Library />
      <Content />
      <SongPanel titulo="Never Let Go" artista="LINGSHOT" capa={albumCover} />
    </div>
  );
}
