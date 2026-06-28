import type { LibraryItemProps } from "../types";

export default function LibraryItem({
  capa,
  titulo,
  artista,
  tipo,
}: LibraryItemProps) {
  return (
    <div className="flex gap-2 items-center cursor-pointer hover:bg-[#2A2A2A] p-1 rounded">
      <img
        src={capa}
        alt={titulo}
        className={`w-10 h-10
            ${tipo === "artista" ? "rounded-full" : "rounded-xs"}`}
      />
      <div>
        <p className="text-[10px] font-bold">{titulo}</p>
        <p className="text-[10px] text-[#B3B3B3]">
          {tipo === "artista" ? "Artista" : `${tipo} • ${artista}`}
        </p>
      </div>
    </div>
  );
}
