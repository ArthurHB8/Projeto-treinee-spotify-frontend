import SobreArtista from "./SobreArtista";
import Creditos from "./Creditos";
import Turne from "./Turne";
import ASeguir from "./ASeguir";
import type { SongPanelProps } from "../types";

export default function SongPanel({ titulo, artista, capa }: SongPanelProps) {
  return (
    <div className="w-[315px] min-w-[315px] shrink-0 p-3 bg-[#121212] rounded-lg text-white max-h-195 overflow-y-auto">
      <img src={capa} className="w-full h-auto object-cover rounded-lg" />

      <div>
        <h2 className="text-[20px] font-bold">{titulo}</h2>
        <p className="text-[12px] text-texto-secundario">{artista}</p>
      </div>

      <SobreArtista />

      <Creditos />

      <Turne />

      <ASeguir />
    </div>
  );
}
