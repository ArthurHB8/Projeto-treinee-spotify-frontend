import Main from "./components/Main";
import NavBar from "./components/NavBar";
import PlayerBar from "./components/PlayerBar";
import TocandoAgoraMobile from "./components/TocandoAgoraMobile";
import { PlayerProvider } from "./context/PlayerContext";

export default function App() {
  return (
    <PlayerProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-black">
        <NavBar />
        <div className="min-h-0 flex-1">
          <Main />
        </div>
        <TocandoAgoraMobile />
        <PlayerBar />
      </div>
    </PlayerProvider>
  );
}
