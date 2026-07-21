import LibraryItem from "./LibraryItem";
import CriarPlaylistModal from "./CriarPlaylistModal";

import searchIcon from "../assets/icons/searchIcon.svg";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserPlaylists,
  getUserRecentAlbums,
  getUserRecentArtists,
} from "../api/user";
import { ordenarItensBiblioteca } from "../utils/bibliotecaOrdenacao";
import type {
  BibliotecaItem,
  BotaoFiltroProps,
  FiltroBiblioteca,
} from "../types";

const BotaoFiltro = ({ texto, ativo, onClick }: BotaoFiltroProps) => {
  return (
    <button
      className={`cursor-pointer rounded-full px-[15.5px] py-2.5 text-[10px] transition-colors ${
        ativo
          ? "bg-white text-black"
          : "bg-[#343333] text-white hover:bg-[#4a4a4a]"
      }`}
      onClick={onClick}
    >
      {texto}
    </button>
  );
};

export default function Library() {
  const navigate = useNavigate();

  const [itens, setItens] = useState<BibliotecaItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [criandoPlaylist, setCriandoPlaylist] = useState(false);

  const [filtroAtivo, setFiltroAtivo] = useState<FiltroBiblioteca>("Tudo");
  const [busca, setBusca] = useState("");

  const carregarBiblioteca = () => {
    setCarregando(true);
    setErro(null);

    Promise.all([
      getUserPlaylists(),
      getUserRecentArtists(),
      getUserRecentAlbums(),
    ])
      .then(([playlists, artistas, albuns]) => {
        const itensPlaylists: BibliotecaItem[] = playlists.map((playlist) => ({
          id: playlist.id,
          tipo: "Playlist",
          titulo: playlist.name,
          artista: "Vitoria Tenorio",
          imageUrl: playlist.imageUrl,
          pinnedAt: null,
          lastUsedAt: playlist.updatedAt ?? playlist.createdAt,
        }));

        const itensArtistas: BibliotecaItem[] = artistas.map((artista) => ({
          id: artista.id,
          tipo: "artista",
          titulo: artista.name,
          artista: artista.name,
          imageUrl: artista.imageUrl,
          pinnedAt: null,
          lastUsedAt: artista.updatedAt ?? artista.createdAt,
        }));

        const itensAlbuns: BibliotecaItem[] = albuns.map((album) => ({
          id: album.id,
          tipo: "Álbum",
          titulo: album.title,
          artista: album.artistName,
          imageUrl: album.imageUrl,
          pinnedAt: null,
          lastUsedAt: album.updatedAt ?? album.createdAt,
        }));

        setItens([...itensPlaylists, ...itensArtistas, ...itensAlbuns]);
      })
      .catch(() => setErro("Não foi possível carregar sua biblioteca."))
      .finally(() => setCarregando(false));
  };

  useEffect(carregarBiblioteca, []);

  const itensFiltrados = ordenarItensBiblioteca(itens).filter((item) => {
    return (
      (filtroAtivo === "Tudo" || item.tipo === filtroAtivo) &&
      item.titulo.toLowerCase().includes(busca.toLowerCase())
    );
  });

  return (
    <div className="max-h-[calc(100vh-63px)] w-16 min-w-16 shrink-0 overflow-y-auto rounded-lg bg-[#121212] p-1 pb-22 text-white md:w-56 md:min-w-56 md:p-3 md:pb-22 lg:w-78 lg:min-w-78">
      <div className="mb-3 hidden items-center justify-between md:flex">
        <h2 className="text-xs font-bold">Sua biblioteca</h2>
        <button
          className="cursor-pointer rounded-2xl border border-[#7c7c7c] px-3 py-1.5 text-[10px] font-bold"
          onClick={() => setCriandoPlaylist(true)}
        >
          Criar playlist
        </button>
      </div>
      <div className="mb-3 hidden gap-2 md:flex">
        <BotaoFiltro
          texto="Tudo"
          ativo={filtroAtivo === "Tudo"}
          onClick={() => setFiltroAtivo("Tudo")}
        />
        <BotaoFiltro
          texto="Playlist"
          ativo={filtroAtivo === "Playlist"}
          onClick={() => setFiltroAtivo("Playlist")}
        />
        <BotaoFiltro
          texto="Álbuns"
          ativo={filtroAtivo === "Álbum"}
          onClick={() => setFiltroAtivo("Álbum")}
        />
        <BotaoFiltro
          texto="Artistas"
          ativo={filtroAtivo === "artista"}
          onClick={() => setFiltroAtivo("artista")}
        />
      </div>

      <div className="hidden h-[20px] gap-1 rounded-sm bg-[#2D2D2D] px-2 py-1 md:flex">
        <img src={searchIcon} alt="Search" className="h-2.5 w-2.5" />
        <input
          placeholder="Buscar em Sua Biblioteca"
          className="w-full rounded-sm bg-transparent text-[10px] outline-none placeholder:text-[#B3B3B3]"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {carregando && (
        <p className="mt-4 hidden text-center text-[10px] text-[#B3B3B3] md:block">
          Carregando...
        </p>
      )}

      {!carregando && erro && (
        <p className="mt-4 hidden text-center text-[10px] text-red-400 md:block">
          {erro}
        </p>
      )}

      {!carregando && !erro && itensFiltrados.length === 0 && (
        <p className="mt-4 hidden text-center text-[10px] text-[#B3B3B3] md:block">
          Nenhum item encontrado
        </p>
      )}

      {!carregando && !erro && (
        <div className="mt-3 flex flex-col items-center gap-2 md:items-stretch">
          {itensFiltrados.map((item) => (
            <LibraryItem
              key={item.id}
              id={item.id}
              titulo={item.titulo}
              artista={item.artista}
              tipo={item.tipo}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      )}

      {criandoPlaylist && (
        <CriarPlaylistModal
          onFechar={() => setCriandoPlaylist(false)}
          onCriada={(playlist) => {
            setCriandoPlaylist(false);
            carregarBiblioteca();
            navigate(`/playlist/${playlist.id}`);
          }}
        />
      )}
    </div>
  );
}
