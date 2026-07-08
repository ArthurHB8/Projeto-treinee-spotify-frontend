import Main from "./components/Main";
import NavBar from "./components/NavBar";
import PlayerBar from "./components/PlayerBar";
import { PlayerProvider } from "./context/PlayerContext";

export default function App() {
  return (
    <PlayerProvider>
      <div className="bg-black w-screen h-screen overflow-hidden">
        <NavBar />
        <div className="mt-[13px]">
          <Main />
        </div>
        <PlayerBar />
      </div>
    </PlayerProvider>
  );
}
