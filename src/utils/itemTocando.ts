import type { ContextoReproducao } from "../context/PlayerContext";

export function itemEstaTocando(
  tipo: "Playlist" | "Álbum" | "artista",
  id: string,
  contextoAtual: ContextoReproducao | null,
  tocando: boolean,
): boolean {
  return (
    tocando && contextoAtual?.tipo === tipo && contextoAtual?.id === id
  );
}
