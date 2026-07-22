import { useEffect, useState } from "react";

import { getArtistById } from "../api/artist";
import type { Artist } from "../api/types";

type CreditosTipo = {
  artistId: string;
};

export default function Creditos({ artistId }: CreditosTipo) {
  const [artista, setArtista] = useState<Artist | null>(null);

  useEffect(() => {
    setArtista(null);

    getArtistById(artistId)
      .then(setArtista)
      .catch(() => setArtista(null));
  }, [artistId]);

  if (!artista) return null;

  return (
    <div className="bg-fundo-cards mt-6 rounded-lg p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold">Creditos</h2>
        <button className="text-texto-secundario text-[10px]">
          Mostrar tudo
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs">{artista.name}</h3>
          <p className="text-texto-secundario text-[10px]">Artista principal</p>
        </div>
        <button className="cursor-pointer rounded-2xl border border-[#7c7c7c] px-3 py-1.5 text-[10px]">
          Seguir
        </button>
      </div>

      <div className="mb-3">
        <h3 className="text-xs">{artista.name}</h3>
        <p className="text-texto-secundario text-[10px]">
          Arranjos • Autores • Letrista
        </p>
      </div>

      <div>
        <h3 className="text-xs">{artista.name}</h3>
        <p className="text-texto-secundario text-[10px]">
          Arranjos • Autores • Letrista
        </p>
      </div>
    </div>
  );
}
