import { Link } from "react-router-dom";

import type { CardArtistaProps, CardPlaylistProps } from "../types";

export const CardPlaylist = ({
  id,
  capa,
  titulo,
  artista,
  onClick,
}: CardPlaylistProps) => (
  <Link
    to={`/playlist/${id}`}
    onClick={onClick}
    className="flex w-19 shrink-0 cursor-pointer flex-col gap-1.5 rounded-sm p-1.5 text-inherit no-underline hover:bg-[#2a2a2a] md:w-37.5"
  >
    {capa ? (
      <img
        src={capa}
        alt={titulo}
        className="h-15 w-15 rounded-sm object-cover shadow-md md:aspect-square md:h-auto md:w-full"
      />
    ) : (
      <div
        className="h-15 w-15 rounded-sm bg-[#2a2a2a] shadow-md md:aspect-square md:h-auto md:w-full"
        aria-hidden="true"
      />
    )}
    <p className="truncate text-[10px] font-bold">{titulo}</p>
    <p className="truncate text-[9px] text-[#B3B3B3]">Playlist • {artista}</p>
  </Link>
);

export const CardAlbum = ({
  id,
  capa,
  titulo,
  artista,
  onClick,
}: CardPlaylistProps) => (
  <Link
    to={`/album/${id}`}
    onClick={onClick}
    className="flex w-19 shrink-0 cursor-pointer flex-col gap-1.5 rounded-sm p-1.5 text-inherit no-underline hover:bg-[#2a2a2a] md:w-37.5"
  >
    {capa ? (
      <img
        src={capa}
        alt={titulo}
        className="h-15 w-15 rounded-sm object-cover shadow-md md:aspect-square md:h-auto md:w-full"
      />
    ) : (
      <div
        className="h-15 w-15 rounded-sm bg-[#2a2a2a] shadow-md md:aspect-square md:h-auto md:w-full"
        aria-hidden="true"
      />
    )}
    <p className="truncate text-[10px] font-bold">{titulo}</p>
    <p className="truncate text-[9px] text-[#B3B3B3]">Álbum • {artista}</p>
  </Link>
);

export const CardArtista = ({ id, capa, nome, onClick }: CardArtistaProps) => (
  <Link
    to={`/artist/${id}`}
    onClick={onClick}
    className="flex min-h-26 shrink-0 cursor-pointer flex-col gap-1.5 rounded-sm p-1.5 text-inherit no-underline hover:bg-[#2a2a2a] md:min-h-43"
  >
    {capa ? (
      <img
        src={capa}
        alt={nome}
        className="h-15 w-15 rounded-full object-cover shadow-md md:h-33 md:w-33"
      />
    ) : (
      <div
        className="flex h-15 w-15 items-center justify-center rounded-full bg-[#2a2a2a] text-sm font-bold shadow-md md:h-33 md:w-33"
        aria-hidden="true"
      >
        {nome.charAt(0).toUpperCase()}
      </div>
    )}
    <p className="truncate text-[10px] font-bold">{nome}</p>
    <p className="text-[9px] text-[#B3B3B3]">Artista</p>
  </Link>
);
