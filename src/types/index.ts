import type { Music } from "../api/types";

export type BotaoFiltroProps = {
  texto: string;
  ativo: boolean;
  onClick: () => void;
};

export type FaixaFila = {
  musica: Music;
  capa: string | null;
  nomeArtista: string;
};

export type LibraryItemTipo = "Playlist" | "artista" | "Álbum";

export type LibraryItemProps = {
  id: string;
  titulo: string;
  artista: string;
  tipo: LibraryItemTipo;
  imageUrl: string | null;
};

export type BibliotecaItem = {
  id: string;
  tipo: LibraryItemTipo;
  titulo: string;
  artista: string;
  imageUrl: string | null;
  pinnedAt: string | null;
  lastUsedAt: string;
};

export type CardAcessoRapidoProps = {
  id: string;
  tipo: "Playlist" | "Álbum";
  capa: string | null;
  titulo: string;
  tocando?: boolean;
};

export type CardPlaylistProps = {
  id: string;
  capa: string | null;
  titulo: string;
  artista: string;
};

export type CardArtistaProps = {
  id: string;
  capa: string | null;
  nome: string;
};

export type EventoTurne = {
  id: number;
  mes: string;
  dia: string;
  cidade: string;
  artistas: string;
  detalhes: string;
  url: string;
};

export type FiltroMain = "Tudo" | "Música" | "Playlists";

export type FiltroBiblioteca = "Tudo" | "Playlist" | "Álbum" | "artista";
