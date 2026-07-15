import { usePlayer } from "../context/PlayerContext";
import { resolveImageUrl } from "../api/client";
import SobreArtista from "./SobreArtista";
import Creditos from "./Creditos";
import Turne from "./Turne";
import ASeguir from "./ASeguir";

export default function SongPanel() {
  const { faixaAtual } = usePlayer();

  const titulo = faixaAtual?.musica.title ?? "Nenhuma música tocando";
  const artista = faixaAtual?.nomeArtista ?? "";
  const capa = faixaAtual ? resolveImageUrl(faixaAtual.capa) : null;

  return (
    <div className="w-[315px] min-w-[315px] shrink-0 p-3 bg-[#121212] rounded-lg text-white max-h-195 overflow-y-auto">
      {capa ? (
        <img src={capa} className="w-full h-auto object-cover rounded-lg" />
      ) : (
        <div
          className="w-full aspect-square bg-[#2a2a2a] rounded-lg"
          aria-hidden="true"
        />
      )}

      <div>
        <h2 className="text-[20px] font-bold">{titulo}</h2>
        <p className="text-[12px] text-texto-secundario">{artista}</p>
      </div>

      {faixaAtual && <SobreArtista artistId={faixaAtual.musica.artistId} />}

      <Creditos />

      <Turne />

      <ASeguir />
    </div>
  );
}
