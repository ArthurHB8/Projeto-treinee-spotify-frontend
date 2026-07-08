import { useState } from "react";

import { createPlaylist } from "../api/playlist";
import type { PlaylistNoMusic } from "../api/types";

type CriarPlaylistModalProps = {
  onFechar: () => void;
  onCriada: (playlist: PlaylistNoMusic) => void;
};

export default function CriarPlaylistModal({ onFechar, onCriada }: CriarPlaylistModalProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const criar = () => {
    if (!nome.trim()) {
      setErro("Dê um nome à playlist.");
      return;
    }

    setEnviando(true);
    setErro(null);

    createPlaylist({ name: nome.trim(), description: descricao.trim() })
      .then(onCriada)
      .catch(() => {
        setErro("Não foi possível criar a playlist.");
        setEnviando(false);
      });
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70]"
      onClick={onFechar}
    >
      <div
        className="bg-[#282828] rounded-md p-6 w-[420px] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Criar playlist</h2>

        <label className="block text-xs font-bold mb-1" htmlFor="nome-playlist">
          Nome
        </label>
        <input
          id="nome-playlist"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Minha playlist"
          className="w-full bg-[#3a3a3a] rounded-sm px-3 py-2 text-sm outline-none mb-3"
          autoFocus
        />

        <label className="block text-xs font-bold mb-1" htmlFor="descricao-playlist">
          Descrição (opcional)
        </label>
        <textarea
          id="descricao-playlist"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Adicione uma descrição opcional"
          className="w-full bg-[#3a3a3a] rounded-sm px-3 py-2 text-sm outline-none mb-3 resize-none h-20"
        />

        {erro && <p className="text-red-400 text-xs mb-3">{erro}</p>}

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm font-bold cursor-pointer text-texto-secundario hover:text-white"
            onClick={onFechar}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm font-bold rounded-full bg-white text-black cursor-pointer disabled:opacity-50"
            onClick={criar}
            disabled={enviando}
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}
