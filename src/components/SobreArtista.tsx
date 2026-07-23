import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getArtistById } from "../api/artist";
import { resolveImageUrl } from "../api/client";
import type { Artist } from "../api/types";
import { formatarNumero as formatarOuvintes } from "../utils/formatarNumero";

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
      <div className="bg-fundo-cards mt-6 rounded-lg p-3">
        <p className="text-texto-secundario text-xs">Carregando artista...</p>
      </div>
    );
  }

  if (!artista) return null;

  const imagem = resolveImageUrl(artista.imageUrl);

  return (
    <div className="bg-fundo-cards mt-6 rounded-lg">
      <div className="relative">
        <p className="absolute top-0 left-0 p-3 text-xs font-bold">
          Sobre o artista
        </p>
        {imagem ? (
          <img
            src={imagem}
            alt={artista.name}
            className="h-45 w-full rounded-lg object-cover"
          />
        ) : (
          <div
            className="aspect-square w-full rounded-lg bg-[#2a2a2a]"
            aria-hidden="true"
          />
        )}
      </div>

      <div>
        <h2 className="p-3 text-xs">
          <Link
            to={`/artist/${artista.id}`}
            className="text-inherit no-underline hover:underline"
          >
            {artista.name}
          </Link>
        </h2>
        <div className="flex items-center justify-between px-3">
          <p className="text-texto-secundario text-[11px]">
            {formatarOuvintes(artista.listeners)} ouvintes mensais
          </p>
          <button className="cursor-pointer rounded-2xl border border-[#7c7c7c] px-3 py-1.5 text-[10px]">
            Seguir
          </button>
        </div>
        {artista.about && (
          <p className="text-texto-secundario p-3 text-[10px]">
            {artista.about}
          </p>
        )}
      </div>
    </div>
  );
}
