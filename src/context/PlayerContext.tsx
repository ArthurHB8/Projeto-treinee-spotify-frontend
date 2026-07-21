import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { FaixaFila } from "../types";

type PlayerContextValue = {
  faixaAtual: FaixaFila | null;
  proximaFaixaFila: FaixaFila | null;
  tocando: boolean;
  progresso: number;
  tocarFaixa: (fila: FaixaFila[], musicaId: string) => void;
  alternarPlayPause: () => void;
  proximaFaixa: () => void;
  faixaAnterior: () => void;
  irParaProgresso: (segundos: number) => void;
  mobileNowPlayingAberto: boolean;
  abrirNowPlayingMobile: () => void;
  fecharNowPlayingMobile: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [fila, setFila] = useState<FaixaFila[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [mobileNowPlayingAberto, setMobileNowPlayingAberto] = useState(false);

  const faixaAtual = fila[indiceAtual] ?? null;
  const proximaFaixaFila = fila[indiceAtual + 1] ?? null;

  const tocarFaixa = (novaFila: FaixaFila[], musicaId: string) => {
    const indice = novaFila.findIndex((item) => item.musica.id === musicaId);
    setFila(novaFila);
    setIndiceAtual(indice === -1 ? 0 : indice);
    setProgresso(0);
    setTocando(true);
  };

  const abrirNowPlayingMobile = () => {
    if (faixaAtual) setMobileNowPlayingAberto(true);
  };

  const fecharNowPlayingMobile = () => setMobileNowPlayingAberto(false);

  const alternarPlayPause = () => {
    if (faixaAtual) setTocando((atual) => !atual);
  };

  const proximaFaixa = () => {
    setIndiceAtual((i) => Math.min(i + 1, fila.length - 1));
    setProgresso(0);
  };

  const faixaAnterior = () => {
    if (progresso > 3) {
      setProgresso(0);
    } else {
      setIndiceAtual((i) => Math.max(i - 1, 0));
      setProgresso(0);
    }
  };

  const irParaProgresso = (segundos: number) => setProgresso(segundos);

  useEffect(() => {
    if (!tocando || !faixaAtual) return;

    const intervalID = setInterval(() => {
      setProgresso((atual) => {
        if (atual >= faixaAtual.musica.duration) {
          if (indiceAtual < fila.length - 1) {
            setIndiceAtual((indice) => indice + 1);
            return 0;
          } else {
            setTocando(false);
            return faixaAtual.musica.duration;
          }
        }

        return atual + 1;
      });
    }, 1000);

    return () => clearInterval(intervalID);
  }, [tocando, faixaAtual, indiceAtual, fila.length]);

  return (
    <PlayerContext.Provider
      value={{
        faixaAtual,
        proximaFaixaFila,
        tocando,
        progresso,
        tocarFaixa,
        alternarPlayPause,
        proximaFaixa,
        faixaAnterior,
        irParaProgresso,
        mobileNowPlayingAberto,
        abrirNowPlayingMobile,
        fecharNowPlayingMobile,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
