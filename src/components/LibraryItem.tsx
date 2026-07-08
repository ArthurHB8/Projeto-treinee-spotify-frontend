import { Link } from "react-router-dom";

import { resolveImageUrl } from "../api/client";
import type { LibraryItemProps } from "../types";

const rotaPorTipo: Record<LibraryItemProps["tipo"], string> = {
  Playlist: "/playlist",
  Álbum: "/album",
  artista: "/artist",
};

export default function LibraryItem({
  id,
  titulo,
  artista,
  tipo,
  imageUrl,
}: LibraryItemProps) {
  const arredondado = tipo === "artista" ? "rounded-full" : "rounded-xs";

  return (
    <Link
      to={`${rotaPorTipo[tipo]}/${id}`}
      className="flex gap-2 items-center cursor-pointer hover:bg-[#2A2A2A] p-1 rounded no-underline text-inherit"
    >
      {imageUrl ? (
        <img
          src={resolveImageUrl(imageUrl)!}
          alt={titulo}
          className={`w-10 h-10 shrink-0 object-cover ${arredondado}`}
        />
      ) : (
        <div
          className={`w-10 h-10 shrink-0 flex items-center justify-center bg-[#2a2a2a] text-white text-sm font-bold ${arredondado}`}
          aria-hidden="true"
        >
          {titulo.charAt(0).toUpperCase()}
        </div>
      )}
      <div>
        <p className="text-[10px] font-bold">{titulo}</p>
        <p className="text-[10px] text-[#B3B3B3]">
          {tipo === "artista" ? "Artista" : `${tipo} • ${artista}`}
        </p>
      </div>
    </Link>
  );
}
