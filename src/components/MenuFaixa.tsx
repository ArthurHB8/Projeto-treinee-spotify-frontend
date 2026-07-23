import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { addMusicToPlaylist, removeMusicFromPlaylist } from "../api/playlist";
import { getUserPlaylists } from "../api/user";
import type { Music, PlaylistNoMusic } from "../api/types";

import addIcon from "../assets/icons/addIcon.svg";
import removeIcon from "../assets/icons/removeIcon.svg";
import addLikedSongsIcon from "../assets/icons/addLikedSongs.svg";
import alreadyLibraryIcon from "../assets/icons/alreadyLibraryIcon.svg";
import goToArtistIcon from "../assets/icons/goToArtistIcon.svg";
import goToAlbumIcon from "../assets/icons/goToAlbumIcon.svg";
import creditsIcon from "../assets/icons/creditsIcon.svg";
import chevronDownIcon from "../assets/icons/chevronDownIcon.svg";

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
  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/10 cursor-pointer";

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
  const [posicao, setPosicao] = useState({ top: y, left: x });

  useLayoutEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const { offsetWidth: largura, offsetHeight: altura } = elemento;
    const margem = 8;

    const top =
      y + altura > window.innerHeight ? Math.max(margem, y - altura) : y;
    const left =
      x + largura > window.innerWidth ? Math.max(margem, x - largura) : x;

    setPosicao({ top, left });
  }, [x, y, mostrandoPlaylists, playlists]);

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

  const salvarEmMusicasCurtidas = () => {
    getUserPlaylists().then((playlistsNomes) => {
      const playlistCurtidas = playlistsNomes.find(
        (p) => p.name === "Músicas Curtidas",
      );
      if (playlistCurtidas) {
        addMusicToPlaylist(playlistCurtidas.id, musica.id);
      }
      onFechar();
    });
  };

  const outrasPlaylists = (playlists ?? []).filter(
    (playlist) => playlist.id !== playlistIdAtual,
  );

  return (
    <div
      ref={ref}
      style={{
        top: posicao.top,
        left: posicao.left,
        maxHeight: "calc(100vh - 16px)",
      }}
      className="fixed z-60 min-w-55 overflow-y-auto rounded-md bg-[#282828] py-1 text-white shadow-xl"
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
            className={`${itemClasse} justify-between`}
            onClick={() => setMostrandoPlaylists(true)}
          >
            <span className="flex items-center gap-2">
              <img src={addIcon} alt="" className="h-3.5 w-3.5" />
              Adicionar à playlist
            </span>
            <img
              src={chevronDownIcon}
              alt=""
              className="h-2.5 w-2.5 -rotate-90"
            />
          </button>

          {playlistIdAtual && (
            <button className={itemClasse} onClick={remover}>
              <img src={removeIcon} alt="" className="h-3.5 w-3.5" />
              Remover desta playlist
            </button>
          )}

          <button className={itemClasse} onClick={salvarEmMusicasCurtidas}>
            <img src={addLikedSongsIcon} alt="" className="h-4 w-4" />
            Salvar em Músicas Curtidas
          </button>

          {musica.playlistsId.length > 0 && (
            <button className={itemClasse}>
              <img src={alreadyLibraryIcon} alt="" className="h-4 w-4" />
              Remover da sua biblioteca
            </button>
          )}

          <div className="my-1 border-t border-white/10" />

          <button
            className={itemClasse}
            onClick={() => {
              navigate(`/artist/${musica.artistId}`);
              onFechar();
            }}
          >
            <img src={goToArtistIcon} alt="" className="h-4 w-4" />
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
              <img src={goToAlbumIcon} alt="" className="h-4 w-4" />
              Ir para o álbum
            </button>
          )}

          <button className={itemClasse}>
            <img src={creditsIcon} alt="" className="h-4 w-4" />
            Ver créditos
          </button>
        </>
      )}
    </div>
  );
}
