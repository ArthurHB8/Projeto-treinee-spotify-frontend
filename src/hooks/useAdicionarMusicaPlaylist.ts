import { useDragDropMonitor } from "@dnd-kit/react";
import { addMusicToPlaylist } from "../api/playlist";
import { useNotificacao } from "../context/NotificacaoContext";
import { ApiError } from "../api/client";

export function useAdicionarMusicaPlaylist(playlistIdAtual?: string): void {
  const { mostrarNotificacao } = useNotificacao();
  useDragDropMonitor({
    onDragEnd(event) {
      if (event.canceled) return;

      const musicIdSource = event.operation.source?.id as string;

      if (event.operation.target?.type !== "playlist") return;

      const { playlistId: targetPlaylist, titulo } = event.operation.target
        .data as { playlistId: string; titulo: string };
      if (targetPlaylist === playlistIdAtual) return;

      addMusicToPlaylist(targetPlaylist, musicIdSource)
        .then(() => mostrarNotificacao(`Adicionado em ${titulo}`))
        .catch((erro) => {
          if (erro instanceof ApiError && erro.status === 400) {
            mostrarNotificacao(`Musica já adicionada em ${titulo}`);
          }
        });
    },
  });
}
