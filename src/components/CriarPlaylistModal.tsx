import { useEffect, useState } from "react";

import { createPlaylist, setPlaylistImage } from "../api/playlist";
import type { PlaylistNoMusic } from "../api/types";

type CriarPlaylistModalProps = {
  onFechar: () => void;
  onCriada: (playlist: PlaylistNoMusic) => void;
};

export default function CriarPlaylistModal({
  onFechar,
  onCriada,
}: CriarPlaylistModalProps) {
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
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70"
      onClick={onFechar}
    >
      <div
        className="w-[420px] rounded-md bg-[#282828] p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-bold">Criar playlist</h2>

        <div className="mb-3 flex gap-4">
          <label
            htmlFor="imagem-playlist"
            className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm bg-[#3a3a3a] text-2xl font-bold"
            title="Escolher foto"
          >
            {preview ? (
              <img
                src={preview}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span aria-hidden="true">
                {nome.trim().charAt(0).toUpperCase() || "+"}
              </span>
            )}
          </label>
          <input
            id="imagem-playlist"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={aoSelecionarArquivo}
          />

          <div className="min-w-0 flex-1">
            <label
              className="mb-1 block text-xs font-bold"
              htmlFor="nome-playlist"
            >
              Nome
            </label>
            <input
              id="nome-playlist"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Minha playlist"
              className="w-full rounded-sm bg-[#3a3a3a] px-3 py-2 text-sm outline-none"
              autoFocus
            />
          </div>
        </div>

        <label
          className="mb-1 block text-xs font-bold"
          htmlFor="descricao-playlist"
        >
          Descrição (opcional)
        </label>
        <textarea
          id="descricao-playlist"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Adicione uma descrição opcional"
          className="mb-3 h-20 w-full resize-none rounded-sm bg-[#3a3a3a] px-3 py-2 text-sm outline-none"
        />

        {erro && <p className="mb-3 text-xs text-red-400">{erro}</p>}

        <div className="flex justify-end gap-2">
          <button
            className="text-texto-secundario cursor-pointer px-4 py-2 text-sm font-bold hover:text-white"
            onClick={onFechar}
          >
            Cancelar
          </button>
          <button
            className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
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
