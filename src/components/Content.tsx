import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { resolveImageUrl } from "../api/client";
import EstadoPagina from "./EstadoPagina";
import {
  getUserPlaylists,
  getUserRecentAlbums,
  getUserRecentArtists,
} from "../api/user";
import type { AlbumNoMusics, Artist, PlaylistNoMusic } from "../api/types";
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

const CardAcessoRapido = ({
  id,
  tipo,
  capa,
  titulo,
}: CardAcessoRapidoProps) => (
  <Link
    to={`${tipo === "Álbum" ? "/album" : "/playlist"}/${id}`}
    className="flex items-center bg-[#2a2a2a] rounded-sm overflow-hidden hover:bg-[#3a3a3a] cursor-pointer h-10 no-underline text-inherit"
  >
    {capa ? (
      <img
        src={capa}
        alt={titulo}
        className="w-10 h-10 object-cover shrink-0"
      />
    ) : (
      <div
        className="w-10 h-10 bg-[#3a3a3a] shrink-0 flex items-center justify-center text-xs font-bold"
        aria-hidden="true"
      >
        {titulo.charAt(0).toUpperCase()}
      </div>
    )}
    <p className="text-xs font-bold px-2 flex-1 truncate">{titulo}</p>
  </Link>
);

const CardPlaylist = ({ id, capa, titulo, artista }: CardPlaylistProps) => (
  <Link
    to={`/playlist/${id}`}
    className="flex flex-col gap-1.5 cursor-pointer hover:bg-[#2a2a2a] p-1.5 rounded-sm no-underline text-inherit shrink-0 w-[150px]"
  >
    {capa ? (
      <img
        src={capa}
        alt={titulo}
        className="w-full aspect-square object-cover rounded-sm shadow-md"
      />
    ) : (
      <div
        className="w-full aspect-square bg-[#2a2a2a] rounded-sm shadow-md"
        aria-hidden="true"
      />
    )}
    <p className="text-[10px] font-bold truncate">{titulo}</p>
    <p className="text-[9px] text-[#B3B3B3] truncate">Playlist • {artista}</p>
  </Link>
);

const CardAlbum = ({ id, capa, titulo, artista }: CardPlaylistProps) => (
  <Link
    to={`/album/${id}`}
    className="flex flex-col gap-1.5 cursor-pointer hover:bg-[#2a2a2a] p-1.5 rounded-sm no-underline text-inherit shrink-0 w-[150px]"
  >
    {capa ? (
      <img
        src={capa}
        alt={titulo}
        className="w-full aspect-square object-cover rounded-sm shadow-md"
      />
    ) : (
      <div
        className="w-full aspect-square bg-[#2a2a2a] rounded-sm shadow-md"
        aria-hidden="true"
      />
    )}
    <p className="text-[10px] font-bold truncate">{titulo}</p>
    <p className="text-[9px] text-[#B3B3B3] truncate">Álbum • {artista}</p>
  </Link>
);

const CardArtista = ({ id, capa, nome }: CardArtistaProps) => (
  <Link
    to={`/artist/${id}`}
    className="flex flex-col gap-1.5 cursor-pointer min-h-[172px] shrink-0 hover:bg-[#2a2a2a] p-1.5 rounded-sm no-underline text-inherit"
  >
    {capa ? (
      <img
        src={capa}
        alt={nome}
        className="w-33 h-33 aspect-square object-cover rounded-full shadow-md"
      />
    ) : (
      <div
        className="w-full aspect-square bg-[#2a2a2a] rounded-full shadow-md flex items-center justify-center text-sm font-bold"
        aria-hidden="true"
      >
        {nome.charAt(0).toUpperCase()}
      </div>
    )}
    <p className="text-[10px] font-bold truncate">{nome}</p>
    <p className="text-[9px] text-[#B3B3B3]">Artista</p>
  </Link>
);

export default function Main() {
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroMain>("Tudo");

  const [playlists, setPlaylists] = useState<PlaylistNoMusic[]>([]);
  const [artistas, setArtistas] = useState<Artist[]>([]);
  const [albuns, setAlbuns] = useState<AlbumNoMusics[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setCarregando(true);
    setErro(null);

    Promise.all([
      getUserPlaylists(),
      getUserRecentArtists(),
      getUserRecentAlbums(),
    ])
      .then(([playlistsResp, artistasResp, albunsResp]) => {
        setPlaylists(playlistsResp);
        setArtistas(artistasResp);
        setAlbuns(albunsResp);
      })
      .catch(() => setErro("Não foi possível carregar a página inicial."))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <EstadoPagina>Carregando...</EstadoPagina>;
  if (erro) return <EstadoPagina><p className="text-red-400">{erro}</p></EstadoPagina>;

  const acessoRapido = [
    ...albuns.map((album) => ({
      id: album.id,
      tipo: "Álbum" as const,
      titulo: album.title,
      capa: resolveImageUrl(album.imageUrl),
    })),
    ...playlists.map((playlist) => ({
      id: playlist.id,
      tipo: "Playlist" as const,
      titulo: playlist.name,
      capa: resolveImageUrl(playlist.imageUrl),
    })),
  ].slice(0, 8);

  return (
    <div className="text-white bg-[#121212] rounded-lg p-3 pb-[88px] flex-1 min-w-0 max-h-195 overflow-y-auto">
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
        {acessoRapido.map((item) => (
          <CardAcessoRapido
            key={`${item.tipo}-${item.id}`}
            id={item.id}
            tipo={item.tipo}
            titulo={item.titulo}
            capa={item.capa}
          />
        ))}
      </div>

      <section className="mb-6">
        <h2 className="text-base font-bold mb-3">Suas Playlists</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {playlists.map((playlist) => (
            <CardPlaylist
              key={playlist.id}
              id={playlist.id}
              capa={resolveImageUrl(playlist.imageUrl)}
              titulo={playlist.name}
              artista="Arthur Braz"
            />
          ))}
        </div>
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold">Artistas recentes</h2>
          <button className="text-[10px] text-[#B3B3B3] hover:text-white cursor-pointer">
            Mostrar tudo
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {artistas.map((artista) => (
            <CardArtista
              key={artista.id}
              id={artista.id}
              capa={resolveImageUrl(artista.imageUrl)}
              nome={artista.name}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold">Álbuns recentes</h2>
          <button className="text-[10px] text-[#B3B3B3] hover:text-white cursor-pointer">
            Mostrar tudo
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {albuns.map((album) => (
            <CardAlbum
              key={album.id}
              id={album.id}
              capa={resolveImageUrl(album.imageUrl)}
              titulo={album.title}
              artista={album.artistName}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
