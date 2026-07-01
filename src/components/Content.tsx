import { useState } from "react";

import playlist3 from "../assets/playlist3.png";
import playlist4bigger from "../assets/playlist4bigger.png";
import aespaArtista2 from "../assets/aespaArtist2.png";
import type {
  BotaoFiltroProps,
  CardAcessoRapidoProps,
  CardArtistaProps,
  CardPlaylistProps,
  FiltroMain,
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

const IconeEqualizer = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="#1ed760"
    className="shrink-0 mr-2"
    aria-hidden="true"
  >
    <rect x="1" y="3" width="2" height="6" rx="0.5" />
    <rect x="5" y="1" width="2" height="10" rx="0.5" />
    <rect x="9" y="4" width="2" height="4" rx="0.5" />
  </svg>
);

const CardAcessoRapido = ({ capa, titulo, tocando }: CardAcessoRapidoProps) => (
  <div className="flex items-center bg-[#2a2a2a] rounded-sm overflow-hidden hover:bg-[#3a3a3a] cursor-pointer h-10">
    <img src={capa} alt={titulo} className="w-10 h-10 object-cover shrink-0" />
    <p className="text-xs font-bold px-2 flex-1 truncate">{titulo}</p>
    {tocando && <IconeEqualizer />}
  </div>
);

const CardPlaylist = ({ capa, titulo, artista }: CardPlaylistProps) => (
  <div className="flex flex-col gap-1.5 cursor-pointer hover:bg-[#2a2a2a] p-1.5 rounded-sm">
    <img
      src={capa}
      alt={titulo}
      className="w-full aspect-square object-cover rounded-sm shadow-md"
    />
    <p className="text-[10px] font-bold truncate">{titulo}</p>
    <p className="text-[9px] text-[#B3B3B3] truncate">Playlist • {artista}</p>
  </div>
);

const CardArtista = ({ capa, nome }: CardArtistaProps) => (
  <div className="flex flex-col gap-1.5 cursor-pointer min-h-[172px] shrink-0 hover:bg-[#2a2a2a] p-1.5 rounded-sm">
    <img
      src={capa}
      alt={nome}
      className="w-full aspect-square object-cover rounded-full shadow-md"
    />
    <p className="text-[10px] font-bold truncate">{nome}</p>
    <p className="text-[9px] text-[#B3B3B3]">Artista</p>
  </div>
);

export default function Main() {
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroMain>("Tudo");

  const acessoRapidoMock = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    titulo: "follow the beat (or die trying)",
    capa: playlist3,
    tocando: i === 2,
  }));

  const playlistsMock = Array.from({ length: 7 }, (_, i) => ({
    id: i + 1,
    titulo: "you know",
    artista: "Arthur Braz",
    capa: playlist4bigger,
  }));

  const artistasMock = [
    { id: 1, nome: "aespa", capa: aespaArtista2 },
    { id: 2, nome: "aespa", capa: aespaArtista2 },
    { id: 3, nome: "aespa", capa: aespaArtista2 },
    { id: 4, nome: "aespa", capa: aespaArtista2 },
    { id: 5, nome: "aespa", capa: aespaArtista2 },
    { id: 6, nome: "aespa", capa: aespaArtista2 },
    { id: 7, nome: "aespa", capa: aespaArtista2 },
    { id: 8, nome: "aespa", capa: aespaArtista2 },
    { id: 9, nome: "aespa", capa: aespaArtista2 },
  ];

  return (
    <div className="text-white bg-[#121212] rounded-lg p-3 flex-1 min-w-0 max-h-[927px] overflow-y-auto">
      <div className="flex gap-2 mb-4">
        <BotaoFiltro
          texto="Tudo"
          ativo={filtroAtivo === "Tudo"}
          onClick={() => setFiltroAtivo("Tudo")}
        />
        <BotaoFiltro
          texto="Música"
          ativo={filtroAtivo === "Música"}
          onClick={() => setFiltroAtivo("Música")}
        />
        <BotaoFiltro
          texto="Playlists"
          ativo={filtroAtivo === "Playlists"}
          onClick={() => setFiltroAtivo("Playlists")}
        />
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {acessoRapidoMock.map((item) => (
          <CardAcessoRapido
            key={item.id}
            capa={item.capa}
            titulo={item.titulo}
            tocando={item.tocando}
          />
        ))}
      </div>

      <section className="mb-6">
        <h2 className="text-base font-bold mb-3">Suas Playlists</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {playlistsMock.map((playlist) => (
            <CardPlaylist
              key={playlist.id}
              capa={playlist.capa}
              titulo={playlist.titulo}
              artista={playlist.artista}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold">Artistas recentes</h2>
          <button className="text-[10px] text-[#B3B3B3] hover:text-white cursor-pointer">
            Mostrar tudo
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {artistasMock.map((artista) => (
            <CardArtista
              key={artista.id}
              capa={artista.capa}
              nome={artista.nome}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
