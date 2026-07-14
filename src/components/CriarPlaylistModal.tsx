import { useEffect, useState } from "react";

import { createPlaylist, setPlaylistImage } from "../api/playlist";
import type { PlaylistNoMusic } from "../api/types";

type CriarPlaylistModalProps = {
  onFechar: () => void;
  onCriada: (playlist: PlaylistNoMusic) => void;
};

export default function CriarPlaylistModal({ onFechar, onCriada }: CriarPlaylistModalProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const aoSelecionarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setArquivo(file);
    setPreview(URL.createObjectURL(file));
  };

  const criar = async () => {
    if (!nome.trim()) {
      setErro("Dê um nome à playlist.");
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      let novaPlaylist: PlaylistNoMusic = await createPlaylist({
        name: nome.trim(),
        description: descricao.trim(),
      });

      if (arquivo) {
        novaPlaylist = await setPlaylistImage(novaPlaylist.id, arquivo);
      }

      onCriada(novaPlaylist);
    } catch {
      setErro("Não foi possível criar a playlist.");
      setEnviando(false);
    }
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

        <div className="flex gap-4 mb-3">
          <label
            htmlFor="imagem-playlist"
            className="w-24 h-24 bg-[#3a3a3a] rounded-sm shrink-0 flex items-center justify-center cursor-pointer overflow-hidden text-2xl font-bold"
            title="Escolher foto"
          >
            {preview ? (
              <img src={preview} alt="" className="w-full h-full object-cover" />
            ) : (
              <span aria-hidden="true">{nome.trim().charAt(0).toUpperCase() || "+"}</span>
            )}
          </label>
          <input
            id="imagem-playlist"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={aoSelecionarArquivo}
          />

          <div className="flex-1 min-w-0">
            <label className="block text-xs font-bold mb-1" htmlFor="nome-playlist">
              Nome
            </label>
            <input
              id="nome-playlist"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Minha playlist"
              className="w-full bg-[#3a3a3a] rounded-sm px-3 py-2 text-sm outline-none"
              autoFocus
            />
          </div>
        </div>

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
