import type { LibraryItemProps } from "../types";

export default function LibraryItem({ titulo, artista, tipo }: LibraryItemProps) {
  return (
    <div className="flex gap-2 items-center cursor-pointer hover:bg-[#2A2A2A] p-1 rounded">
      <div
        className={`w-10 h-10 shrink-0 flex items-center justify-center bg-[#2a2a2a] text-white text-sm font-bold
            ${tipo === "artista" ? "rounded-full" : "rounded-xs"}`}
        aria-hidden="true"
      >
        {titulo.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="text-[10px] font-bold">{titulo}</p>
        <p className="text-[10px] text-[#B3B3B3]">
          {tipo === "artista" ? "Artista" : `${tipo} • ${artista}`}
        </p>
      </div>
    </div>
  );
}
