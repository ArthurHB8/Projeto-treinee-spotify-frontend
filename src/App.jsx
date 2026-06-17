import SongPanel from "./components/SongPanel"; // Ajuste o caminho se sua pasta chamar algo diferente
import albumCover from "./assets/album-cover.png";
import Library from "./components/Library";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#000",
        minHeight: "100vh",
        spaceBetween: "20px",
      }}
    >
      <Library />
      <SongPanel titulo="Never Let Go" artista="LINGSHOT" capa={albumCover} />
    </div>
  );
}
