import { Link } from "react-router-dom";
import { useDroppable } from "@dnd-kit/react";

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

  const { ref, isDropTarget } = useDroppable<{ playlistId: string }>({
    id: `library-playlist-${id}`,
    type: "playlist",
    accept: "song",
    disabled: tipo !== "Playlist",
    data: { playlistId: id },
  });

  return (
    <Link
      ref={ref}
      to={`${rotaPorTipo[tipo]}/${id}`}
      aria-label={titulo}
      className={`flex cursor-pointer items-center justify-center gap-0 rounded p-1 text-inherit no-underline hover:bg-[#2A2A2A] md:justify-start md:gap-2 ${isDropTarget ? "bg-white/10" : ""}`}
    >
      {imageUrl ? (
        <img
          src={resolveImageUrl(imageUrl)!}
          alt={titulo}
          className={`h-10 w-10 shrink-0 object-cover ${arredondado}`}
        />
      ) : (
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center bg-[#2a2a2a] text-sm font-bold text-white ${arredondado}`}
          aria-hidden="true"
        >
          {titulo.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="hidden md:block">
        <p className="text-[10px] font-bold">{titulo}</p>
        <p className="text-[10px] text-[#B3B3B3]">
          {tipo === "artista" ? "Artista" : `${tipo} • ${artista}`}
        </p>
      </div>
    </Link>
  );
}
