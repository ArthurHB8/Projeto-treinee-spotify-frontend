import LibraryItem from "./LibraryItem";

import searchIcon from "../assets/icons/searchIcon.svg";

import { useEffect, useState } from "react";
import { getUserPlaylists, getUserRecentAlbums, getUserRecentArtists } from "../api/user";
import { ordenarItensBiblioteca } from "../utils/bibliotecaOrdenacao";
import type { BibliotecaItem, BotaoFiltroProps, FiltroBiblioteca } from "../types";

const BotaoFiltro = ({ texto, ativo, onClick }: BotaoFiltroProps) => {
  return (
    <button
      className={`px-[15.5px] py-2.5 text-[10px] rounded-full cursor-pointer transition-colors ${
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
  const [itens, setItens] = useState<BibliotecaItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [filtroAtivo, setFiltroAtivo] = useState<FiltroBiblioteca>("Tudo");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    setCarregando(true);
    setErro(null);

    Promise.all([getUserPlaylists(), getUserRecentArtists(), getUserRecentAlbums()])
      .then(([playlists, artistas, albuns]) => {
        const itensPlaylists: BibliotecaItem[] = playlists.map((playlist) => ({
          id: playlist.id,
          tipo: "Playlist",
          titulo: playlist.name,
          artista: "Arthur Braz",
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
  }, []);

  const itensFiltrados = ordenarItensBiblioteca(itens).filter((item) => {
    return (
      (filtroAtivo === "Tudo" || item.tipo === filtroAtivo) &&
      item.titulo.toLowerCase().includes(busca.toLowerCase())
    );
  });

  return (
    <div className="text-white bg-[#121212] rounded-lg p-3 w-[312px] min-w-[312px] shrink-0 max-h-[927px] overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xs font-bold">Sua biblioteca</h2>
        <button className="px-3 py-1.5 text-[10px] font-bold border border-[#7c7c7c] rounded-2xl cursor-pointer">
          Criar playlist
        </button>
      </div>
      <div className="flex gap-2 mb-3">
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

      <div className="flex bg-[#2D2D2D] rounded-sm px-2 py-1 h-[20px] gap-1">
        <img src={searchIcon} alt="Search" className="w-2.5 h-2.5" />
        <input
          placeholder="Buscar em Sua Biblioteca"
          className="text-[10px] placeholder:text-[#B3B3B3] rounded-sm w-full outline-none bg-transparent"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {carregando && (
        <p className="text-center text-[10px] text-[#B3B3B3] mt-4">Carregando...</p>
      )}

      {!carregando && erro && (
        <p className="text-center text-[10px] text-red-400 mt-4">{erro}</p>
      )}

      {!carregando && !erro && itensFiltrados.length === 0 && (
        <p className="text-center text-[10px] text-[#B3B3B3] mt-4">
          Nenhum item encontrado
        </p>
      )}

      {!carregando && !erro && (
        <div className="mt-3 flex flex-col gap-2">
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
    </div>
  );
}
