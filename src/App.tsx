import Main from "./components/Main";
import NavBar from "./components/NavBar";
import PlayerBar from "./components/PlayerBar";
import TocandoAgoraMobile from "./components/TocandoAgoraMobile";
import Notificacao from "./components/Notificacao";
import { PlayerProvider } from "./context/PlayerContext";
import { NotificacaoProvider } from "./context/NotificacaoContext";
import { BibliotecaProvider } from "./context/BibliotecaContext";

export default function App() {
  return (
    <NotificacaoProvider>
      <BibliotecaProvider>
        <PlayerProvider>
          <div className="flex h-screen w-screen flex-col overflow-hidden bg-black">
            <NavBar />
            <div className="min-h-0 flex-1">
              <Main />
            </div>
            <TocandoAgoraMobile />
            <PlayerBar />
            <Notificacao />
          </div>
        </PlayerProvider>
      </BibliotecaProvider>
    </NotificacaoProvider>
  );
}
