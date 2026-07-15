import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { addMusicToPlaylist, removeMusicFromPlaylist } from "../api/playlist";
import { getUserPlaylists } from "../api/user";
import type { Music, PlaylistNoMusic } from "../api/types";

type MenuFaixaProps = {
  musica: Music;
  x: number;
  y: number;
  playlistIdAtual?: string;
  ocultarLinkAlbum?: boolean;
  onFechar: () => void;
  onFaixaRemovida?: () => void;
};

const itemClasse =
  "w-full text-left px-3 py-2 hover:bg-white/10 cursor-pointer text-sm";

export default function MenuFaixa({
  musica,
  x,
  y,
  playlistIdAtual,
  ocultarLinkAlbum,
  onFechar,
  onFaixaRemovida,
}: MenuFaixaProps) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [mostrandoPlaylists, setMostrandoPlaylists] = useState(false);
  const [playlists, setPlaylists] = useState<PlaylistNoMusic[] | null>(null);

  useEffect(() => {
    const aoClicarFora = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onFechar();
    };
    const aoPressionarTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoPressionarTecla);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoPressionarTecla);
    };
  }, [onFechar]);

  useEffect(() => {
    if (mostrandoPlaylists && playlists === null) {
      getUserPlaylists().then(setPlaylists);
    }
  }, [mostrandoPlaylists, playlists]);

  const adicionar = (playlistId: string) => {
    addMusicToPlaylist(playlistId, musica.id).then(onFechar);
  };

  const remover = () => {
    if (!playlistIdAtual) return;

    removeMusicFromPlaylist(playlistIdAtual, musica.id).then(() => {
      onFaixaRemovida?.();
      onFechar();
    });
  };

  const outrasPlaylists = (playlists ?? []).filter(
    (playlist) => playlist.id !== playlistIdAtual,
  );

  return (
    <div
      ref={ref}
      style={{ top: y, left: x }}
      className="fixed z-[60] min-w-[220px] rounded-md bg-[#282828] py-1 text-white shadow-xl"
    >
      {mostrandoPlaylists ? (
        <>
          {outrasPlaylists.map((playlist) => (
            <button
              key={playlist.id}
              className={itemClasse}
              onClick={() => adicionar(playlist.id)}
            >
              {playlist.name}
            </button>
          ))}
          {playlists !== null && outrasPlaylists.length === 0 && (
            <p className="text-texto-secundario px-3 py-2 text-xs">
              Nenhuma outra playlist
            </p>
          )}
        </>
      ) : (
        <>
          <button
            className={itemClasse}
            onClick={() => setMostrandoPlaylists(true)}
          >
            Adicionar à playlist
          </button>
          <button
            className={itemClasse}
            onClick={() => {
              navigate(`/artist/${musica.artistId}`);
              onFechar();
            }}
          >
            Ir para o artista
          </button>
          {!ocultarLinkAlbum && (
            <button
              className={itemClasse}
              onClick={() => {
                navigate(`/album/${musica.albumId}`);
                onFechar();
              }}
            >
              Ir para o álbum
            </button>
          )}
          {playlistIdAtual && (
            <button className={`${itemClasse} text-red-400`} onClick={remover}>
              Remover da playlist
            </button>
          )}
        </>
      )}
    </div>
  );
}
