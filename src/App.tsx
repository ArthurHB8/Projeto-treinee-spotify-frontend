import Main from "./components/Main";
import NavBar from "./components/NavBar";
import PlayerBar from "./components/PlayerBar";
import TocandoAgoraMobile from "./components/TocandoAgoraMobile";
import { PlayerProvider } from "./context/PlayerContext";

export default function App() {
  return (
    <PlayerProvider>
      <div className="h-screen w-screen overflow-hidden bg-black">
        <NavBar />
        <div className="mt-[13px]">
          <Main />
        </div>
        <TocandoAgoraMobile />
        <PlayerBar />
      </div>
    </PlayerProvider>
  );
}
