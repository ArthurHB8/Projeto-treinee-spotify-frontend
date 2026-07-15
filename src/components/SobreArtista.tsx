import { useEffect, useState } from "react";

import { getArtistById } from "../api/artist";
import { resolveImageUrl } from "../api/client";
import type { Artist } from "../api/types";

const formatarOuvintes = (n: number) =>
  new Intl.NumberFormat("pt-BR").format(n);

type SobreArtistaProps = {
  artistId: string;
};

export default function SobreArtista({ artistId }: SobreArtistaProps) {
  const [artista, setArtista] = useState<Artist | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);
    setArtista(null);

    getArtistById(artistId)
      .then(setArtista)
      .catch(() => setArtista(null))
      .finally(() => setCarregando(false));
  }, [artistId]);

  if (carregando) {
    return (
      <div className="bg-fundo-cards rounded-lg mt-6 p-3">
        <p className="text-xs text-texto-secundario">Carregando artista...</p>
      </div>
    );
  }

  if (!artista) return null;

  const imagem = resolveImageUrl(artista.imageUrl);

  return (
    <div className="bg-fundo-cards rounded-lg mt-6">
      <div className="relative">
        <p className="text-xs font-bold absolute top-0 left-0 p-3">
          Sobre o artista
        </p>
        {imagem ? (
          <img
            src={imagem}
            alt={artista.name}
            className="w-full h-auto object-cover rounded-lg"
          />
        ) : (
          <div
            className="w-full aspect-square bg-[#2a2a2a] rounded-lg"
            aria-hidden="true"
          />
        )}
      </div>

      <div>
        <h2 className="text-xs p-3">{artista.name}</h2>
        <div className="flex items-center justify-between px-3">
          <p className="text-[11px] text-texto-secundario">
            {formatarOuvintes(artista.listeners)} ouvintes mensais
          </p>
          <button className="px-3 py-1.5 text-[10px] border border-[#7c7c7c] rounded-2xl cursor-pointer">
            Deixar de seguir
          </button>
        </div>
        {artista.about && (
          <p className="text-[10px] text-texto-secundario p-3">
            {artista.about}
          </p>
        )}
      </div>
    </div>
  );
}
