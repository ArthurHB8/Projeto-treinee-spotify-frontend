import SongPanel from "./components/SongPanel";
import albumCover from "./assets/album-cover.png";
import Library from "./components/Library";
import Main from "./components/Main";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#000",
        minHeight: "100vh",
        gap: "20px",
      }}
    >
      <Library />
      <Main />
      <SongPanel titulo="Never Let Go" artista="LINGSHOT" capa={albumCover} />
    </div>
  );
}
