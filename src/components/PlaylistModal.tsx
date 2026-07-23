import { useEffect, useState } from "react";

import {
  createPlaylist,
  deletePlaylist,
  editPlaylistAttributes,
  setPlaylistImage,
} from "../api/playlist";
import { resolveImageUrl } from "../api/client";
import type { Playlist, PlaylistNoMusic } from "../api/types";

type PlaylistModalProps = {
  playlist?: Pick<Playlist, "id" | "name" | "description" | "imageUrl">;
  onFechar: () => void;
  onSalva: (playlist: PlaylistNoMusic) => void;
  onExcluida?: () => void;
};

export default function PlaylistModal({
  playlist,
  onFechar,
  onSalva,
  onExcluida,
}: PlaylistModalProps) {
  const editando = !!playlist;

  const [nome, setNome] = useState(playlist?.name ?? "");
  const [descricao, setDescricao] = useState(playlist?.description ?? "");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    resolveImageUrl(playlist?.imageUrl ?? null),
  );
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (arquivo && preview) URL.revokeObjectURL(preview);
    };
  }, [arquivo, preview]);

  const aoSelecionarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setArquivo(file);
    setPreview(URL.createObjectURL(file));
  };

  const salvar = async () => {
    if (!nome.trim()) {
      setErro("Dê um nome à playlist.");
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      let playlistSalva: PlaylistNoMusic;

      if (playlist) {
        playlistSalva = await editPlaylistAttributes(playlist.id, {
          name: nome.trim(),
          description: descricao.trim(),
        });

        if (arquivo) {
          playlistSalva = await setPlaylistImage(playlist.id, arquivo);
        }
      } else {
        playlistSalva = await createPlaylist({
          name: nome.trim(),
          description: descricao.trim(),
        });

        if (arquivo) {
          playlistSalva = await setPlaylistImage(playlistSalva.id, arquivo);
        }
      }

      onSalva(playlistSalva);
    } catch {
      setErro(
        editando
          ? "Não foi possível salvar as alterações."
          : "Não foi possível criar a playlist.",
      );
      setEnviando(false);
    }
  };

  const excluir = async () => {
    if (!playlist) return;

    setEnviando(true);
    setErro(null);

    try {
      await deletePlaylist(playlist.id);
      onExcluida?.();
    } catch {
      setErro("Não foi possível excluir a playlist.");
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
        <h2 className="mb-4 text-lg font-bold">
          {editando ? "Editar playlist" : "Criar playlist"}
        </h2>

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

        <div className="flex items-center justify-between gap-2">
          {editando ? (
            <button
              className="cursor-pointer text-xs font-bold text-red-400 hover:text-red-300"
              onClick={excluir}
              disabled={enviando}
            >
              Excluir playlist
            </button>
          ) : (
            <span />
          )}

          <div className="flex justify-end gap-2">
            <button
              className="text-texto-secundario cursor-pointer px-4 py-2 text-sm font-bold hover:text-white"
              onClick={onFechar}
            >
              Cancelar
            </button>
            <button
              className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
              onClick={salvar}
              disabled={enviando}
            >
              {editando ? "Salvar" : "Criar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
