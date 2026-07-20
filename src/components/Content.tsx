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

const CardAcessoRapido = ({
  id,
  tipo,
  capa,
  titulo,
}: CardAcessoRapidoProps) => (
  <Link
    to={`${tipo === "Álbum" ? "/album" : "/playlist"}/${id}`}
    className="flex h-10 cursor-pointer items-center overflow-hidden rounded-sm bg-[#2a2a2a] text-inherit no-underline hover:bg-[#3a3a3a]"
  >
    {capa ? (
      <img
        src={capa}
        alt={titulo}
        className="h-10 w-10 shrink-0 object-cover"
      />
    ) : (
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#3a3a3a] text-xs font-bold"
        aria-hidden="true"
      >
        {titulo.charAt(0).toUpperCase()}
      </div>
    )}
    <p className="flex-1 truncate px-2 text-xs font-bold">{titulo}</p>
  </Link>
);

const CardPlaylist = ({ id, capa, titulo, artista }: CardPlaylistProps) => (
  <Link
    to={`/playlist/${id}`}
    className="flex w-[76px] shrink-0 cursor-pointer flex-col gap-1.5 rounded-sm p-1.5 text-inherit no-underline hover:bg-[#2a2a2a] md:w-[150px]"
  >
    {capa ? (
      <img
        src={capa}
        alt={titulo}
        className="h-[60px] w-[60px] rounded-sm object-cover shadow-md md:aspect-square md:h-auto md:w-full"
      />
    ) : (
      <div
        className="h-[60px] w-[60px] rounded-sm bg-[#2a2a2a] shadow-md md:aspect-square md:h-auto md:w-full"
        aria-hidden="true"
      />
    )}
    <p className="truncate text-[10px] font-bold">{titulo}</p>
    <p className="truncate text-[9px] text-[#B3B3B3]">Playlist • {artista}</p>
  </Link>
);

const CardAlbum = ({ id, capa, titulo, artista }: CardPlaylistProps) => (
  <Link
    to={`/album/${id}`}
    className="flex w-[76px] shrink-0 cursor-pointer flex-col gap-1.5 rounded-sm p-1.5 text-inherit no-underline hover:bg-[#2a2a2a] md:w-[150px]"
  >
    {capa ? (
      <img
        src={capa}
        alt={titulo}
        className="h-[60px] w-[60px] rounded-sm object-cover shadow-md md:aspect-square md:h-auto md:w-full"
      />
    ) : (
      <div
        className="h-[60px] w-[60px] rounded-sm bg-[#2a2a2a] shadow-md md:aspect-square md:h-auto md:w-full"
        aria-hidden="true"
      />
    )}
    <p className="truncate text-[10px] font-bold">{titulo}</p>
    <p className="truncate text-[9px] text-[#B3B3B3]">Álbum • {artista}</p>
  </Link>
);

const CardArtista = ({ id, capa, nome }: CardArtistaProps) => (
  <Link
    to={`/artist/${id}`}
    className="flex min-h-[104px] shrink-0 cursor-pointer flex-col gap-1.5 rounded-sm p-1.5 text-inherit no-underline hover:bg-[#2a2a2a] md:min-h-[172px]"
  >
    {capa ? (
      <img
        src={capa}
        alt={nome}
        className="h-[60px] w-[60px] rounded-full object-cover shadow-md md:h-33 md:w-33"
      />
    ) : (
      <div
        className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#2a2a2a] text-sm font-bold shadow-md md:h-33 md:w-33"
        aria-hidden="true"
      >
        {nome.charAt(0).toUpperCase()}
      </div>
    )}
    <p className="truncate text-[10px] font-bold">{nome}</p>
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
  if (erro)
    return (
      <EstadoPagina>
        <p className="text-red-400">{erro}</p>
      </EstadoPagina>
    );

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
    <div className="max-h-[calc(100vh-63px)] min-w-0 flex-1 overflow-y-auto rounded-lg bg-[#121212] p-3 pb-[88px] text-white">
      <div className="mb-4 flex gap-2">
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

      <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-4">
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
        <h2 className="mb-3 text-base font-bold">Suas Playlists</h2>
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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">Artistas recentes</h2>
          <button className="cursor-pointer text-[10px] text-[#B3B3B3] hover:text-white">
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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">Álbuns recentes</h2>
          <button className="cursor-pointer text-[10px] text-[#B3B3B3] hover:text-white">
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
