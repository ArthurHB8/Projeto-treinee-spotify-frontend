import LibraryItem from "./LibraryItem";

import searchIcon from "../assets/search-icon.svg";
import lemonadeCapa from "../assets/lemonade.png";
import likedSongs from "../assets/likedSongs.png";
import aespaArtista from "../assets/aespaArtist.png";
import kendrickArtista from "../assets/kendrickArtist.png";
import playlist3 from "../assets/playlist3.png";
import playlist2 from "../assets/playlist2.png";
import playlist1 from "../assets/playlist1.png";
import playlist4 from "../assets/playlist4.png";

import { useState } from "react";
import type {
  BotaoFiltroProps,
  FiltroBiblioteca,
  LibraryItemTipo,
} from "../types";

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

type BibliotecaItem = {
  id: number;
  tipo: LibraryItemTipo;
  titulo: string;
  artista: string;
  capa: string;
};

export default function Library() {
  const bibliotecaMock: BibliotecaItem[] = [
    {
      id: 1,
      tipo: "Playlist",
      titulo: "Músicas curtidas",
      artista: "Arthur Braz",
      capa: likedSongs,
    },
    {
      id: 2,
      tipo: "artista",
      titulo: "aespa",
      artista: "aespa",
      capa: aespaArtista,
    },
    {
      id: 3,
      tipo: "Álbum",
      titulo: "LEMONADE - The 2nd Album",
      artista: "aespa",
      capa: lemonadeCapa,
    },
    {
      id: 4,
      tipo: "Playlist",
      titulo: "follow the beat (or die trying)",
      artista: "Arthur Braz",
      capa: playlist3,
    },
    {
      id: 5,
      tipo: "Playlist",
      titulo: "foreign",
      artista: "Arthur Braz",
      capa: playlist2,
    },
    {
      id: 6,
      tipo: "Playlist",
      titulo: "you know",
      artista: "Arthur Braz",
      capa: playlist4,
    },
    {
      id: 7,
      tipo: "artista",
      titulo: "Kendrick Lamar",
      artista: "Kendrick Lamar",
      capa: kendrickArtista,
    },
    {
      id: 8,
      tipo: "Playlist",
      titulo: "flow state",
      artista: "Arthur Braz",
      capa: playlist1,
    },
    {
      id: 9,
      tipo: "Álbum",
      titulo: "LEMONADE - The 2nd Album",
      artista: "aespa",
      capa: lemonadeCapa,
    },
    {
      id: 10,
      tipo: "Playlist",
      titulo: "follow the beat (or die trying)",
      artista: "Arthur Braz",
      capa: playlist3,
    },
    {
      id: 11,
      tipo: "Playlist",
      titulo: "foreign",
      artista: "Arthur Braz",
      capa: playlist2,
    },
    {
      id: 12,
      tipo: "Playlist",
      titulo: "you know",
      artista: "Arthur Braz",
      capa: playlist4,
    },
    {
      id: 13,
      tipo: "artista",
      titulo: "Kendrick Lamar",
      artista: "Kendrick Lamar",
      capa: kendrickArtista,
    },
    {
      id: 14,
      tipo: "Playlist",
      titulo: "flow state",
      artista: "Arthur Braz",
      capa: playlist1,
    },
    {
      id: 15,
      tipo: "Álbum",
      titulo: "LEMONADE - The 2nd Album",
      artista: "aespa",
      capa: lemonadeCapa,
    },
  ];

  const [filtroAtivo, setFiltroAtivo] = useState<FiltroBiblioteca>("Tudo");

  const [busca, setBusca] = useState("");

  const itensFiltrados = bibliotecaMock.filter((item) => {
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

      {itensFiltrados.length === 0 && (
        <p className="text-center text-[10px] text-[#B3B3B3] mt-4">
          Nenhum item encontrado
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2">
        {itensFiltrados.map((item) => (
          <LibraryItem
            key={item.id}
            capa={item.capa}
            titulo={item.titulo}
            artista={item.artista}
            tipo={item.tipo}
          />
        ))}
      </div>
    </div>
  );
}
