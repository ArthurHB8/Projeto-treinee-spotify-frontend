import { usePlayer } from "../context/PlayerContext";
import { resolveImageUrl } from "../api/client";

export default function ASeguir() {
  const { proximaFaixaFila } = usePlayer();

  if (!proximaFaixaFila) return null;

  const capa = resolveImageUrl(proximaFaixaFila.capa);

  return (
    <div className="bg-fundo-cards mt-6 overflow-hidden rounded-lg p-3">
      <h2 className="mb-3 text-xs font-bold">A Seguir</h2>

      <div className="flex items-center gap-3">
        <div className="h-10.5 w-10.5">
          {capa ? (
            <img
              src={capa}
              alt={proximaFaixaFila.musica.title}
              className="h-full w-full rounded object-cover"
            />
          ) : (
            <div
              className="h-full w-full rounded bg-[#2a2a2a]"
              aria-hidden="true"
            />
          )}
        </div>
        <div>
          <h3 className="text-[11px] font-semibold">
            {proximaFaixaFila.musica.title}
          </h3>
          <p className="text text-texto-secundario text-[10px]">
            {proximaFaixaFila.nomeArtista}
          </p>
        </div>
      </div>
    </div>
  );
}
