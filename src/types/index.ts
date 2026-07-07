export type BotaoFiltroProps = {
  texto: string;
  ativo: boolean;
  onClick: () => void;
};

export type LibraryItemTipo = "Playlist" | "artista" | "Álbum";

export type LibraryItemProps = {
  titulo: string;
  artista: string;
  tipo: LibraryItemTipo;
};

export type BibliotecaItem = {
  id: string;
  tipo: LibraryItemTipo;
  titulo: string;
  artista: string;
  pinnedAt: string | null;
  lastUsedAt: string;
};

export type SongPanelProps = {
  titulo: string;
  artista: string;
  capa: string;
};

export type CardAcessoRapidoProps = {
  capa: string;
  titulo: string;
  tocando?: boolean;
};

export type CardPlaylistProps = {
  capa: string;
  titulo: string;
  artista: string;
};

export type CardArtistaProps = {
  capa: string;
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
