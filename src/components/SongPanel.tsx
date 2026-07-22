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
    <div className="hidden h-full min-h-0 shrink-0 overflow-y-auto rounded-lg bg-[#121212] p-3 text-white lg:block lg:w-78.75 lg:min-w-78.75">
      {capa ? (
        <img src={capa} className="h-auto w-full rounded-lg object-cover" />
      ) : (
        <div
          className="aspect-square w-full rounded-lg bg-[#2a2a2a]"
          aria-hidden="true"
        />
      )}

      <div>
        <h2 className="text-[20px] font-bold">{titulo}</h2>
        <p className="text-texto-secundario text-[12px]">{artista}</p>
      </div>

      {faixaAtual && <SobreArtista artistId={faixaAtual.musica.artistId} />}

      <Creditos />

      <Turne />

      <ASeguir />
    </div>
  );
}
