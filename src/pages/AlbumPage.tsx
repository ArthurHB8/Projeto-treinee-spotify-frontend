import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDraggable } from "@dnd-kit/react";

import { getAlbumById } from "../api/album";
import { resolveImageUrl } from "../api/client";
import { usePlayer } from "../context/PlayerContext";
import MenuFaixa from "../components/MenuFaixa";
import EstadoPagina from "../components/EstadoPagina";
import pauseIcon from "../assets/icons/pauseIcon.svg";
import playIcon from "../assets/icons/playIcon.svg";
import type { Album, Music } from "../api/types";
import type { FaixaFila } from "../types";
import { useAdicionarMusicaPlaylist } from "../hooks/useAdicionarMusicaPlaylist";

const formatarDuracao = (segundos: number) => {
  const minutos = Math.floor(segundos / 60);
  const restante = segundos % 60;
  return `${minutos}:${String(restante).padStart(2, "0")}`;
};

const formatarDuracaoTotal = (segundos: number) => {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  return horas > 0
    ? `${horas}h${String(minutos).padStart(2, "0")}min`
    : `${minutos} min`;
};

const formatarReproducoes = (n: number) =>
  new Intl.NumberFormat("pt-BR").format(n);

const IconeRelogio = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 7v5l3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconeMais = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);

type AlbumSongRows = {
  musica: Music;
  index: number;
  aoTocar: () => void;
  aoAbrirMenu: (e: React.MouseEvent) => void;
};

const AlbumSongs = ({ musica, index, aoTocar, aoAbrirMenu }: AlbumSongRows) => {
  const { ref } = useDraggable({ id: musica.id, type: "song" });

  return (
    <div
      ref={ref}
      onClick={aoTocar}
      onContextMenu={(e) => {
        e.preventDefault();
        aoAbrirMenu(e);
      }}
      className="group grid cursor-pointer grid-cols-[24px_1fr_60px] items-center gap-3 rounded-sm px-2 py-2 text-xs hover:bg-white/10 xl:grid-cols-[24px_1fr_140px_100px]"
    >
      <span className="text-texto-secundario">{index + 1}</span>
      <div className="flex min-w-0 items-center gap-2">
        <p className="truncate font-medium">{musica.title}</p>
        {musica.explicit && (
          <span className="bg-texto-secundario shrink-0 rounded-xs px-1 text-[9px] leading-tight font-bold text-black">
            E
          </span>
        )}
      </div>
      <span className="text-texto-secundario hidden xl:block">
        {formatarReproducoes(musica.timesListen)}
      </span>
      <div className="text-texto-secundario flex items-center justify-end gap-3">
        <span>{formatarDuracao(musica.duration)}</span>
        <button
          className="hidden cursor-pointer opacity-0 group-hover:opacity-100 xl:block"
          aria-label="Mais opções"
          onClick={(e) => {
            e.stopPropagation();
            aoAbrirMenu(e);
          }}
        >
          <IconeMais />
        </button>
      </div>
    </div>
  );
};

export default function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const { faixaAtual, tocando, tocarFaixa, alternarPlayPause } = usePlayer();

  const [album, setAlbum] = useState<Album | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [menuFaixa, setMenuFaixa] = useState<{
    musica: Music;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!id) return;

    setCarregando(true);
    setErro(null);

    getAlbumById(id)
      .then(setAlbum)
      .catch(() => setErro("Não foi possível carregar o álbum."))
      .finally(() => setCarregando(false));
  }, [id]);

  useAdicionarMusicaPlaylist();

  if (carregando) return <EstadoPagina>Carregando álbum...</EstadoPagina>;
  if (erro)
    return (
      <EstadoPagina>
        <p className="text-red-400">{erro}</p>
      </EstadoPagina>
    );
  if (!album) return <EstadoPagina>Álbum não encontrado.</EstadoPagina>;

  const capaAlbum = resolveImageUrl(album.imageUrl);

  const filaAlbum: FaixaFila[] = album.musics.map((musica) => ({
    musica,
    capa: album.imageUrl,
    nomeArtista: album.artistName,
  }));

  const faixaAtualEDesteAlbum =
    !!faixaAtual &&
    filaAlbum.some((item) => item.musica.id === faixaAtual.musica.id);
  const tocandoEsteAlbum = tocando && faixaAtualEDesteAlbum;

  const alternarAlbum = () => {
    if (faixaAtualEDesteAlbum) {
      alternarPlayPause();
    } else if (album.musics[0]) {
      tocarFaixa(filaAlbum, album.musics[0].id);
    }
  };

  return (
    <div className="max-h-[calc(100vh-63px)] min-w-0 flex-1 overflow-y-auto rounded-lg bg-[#121212] pb-[88px] text-white">
      <div className="flex flex-col items-start gap-4 bg-linear-to-b from-[#5f5f5f] to-[#121212] p-4 xl:flex-row xl:items-end xl:gap-6 xl:p-6">
        {capaAlbum ? (
          <img
            src={capaAlbum}
            alt={album.title}
            className="h-[120px] w-[120px] shrink-0 object-cover shadow-2xl xl:h-[192px] xl:w-[192px]"
          />
        ) : (
          <div
            className="h-[120px] w-[120px] shrink-0 bg-[#2a2a2a] xl:h-[192px] xl:w-[192px]"
            aria-hidden="true"
          />
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold">Álbum</p>
          <h1 className="my-2 truncate text-[28px] leading-none font-bold xl:text-[64px]">
            {album.title}
          </h1>
          <div className="flex items-center gap-1.5 text-[10px]">
            <Link
              to={`/artist/${album.artistId}`}
              className="font-bold hover:underline"
            >
              {album.artistName}
            </Link>
            <span className="text-texto-secundario">
              • {album.year} • {album.musics.length} músicas,{" "}
              {formatarDuracaoTotal(
                album.musics.reduce((total, m) => total + m.duration, 0),
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 md:px-6">
        <button
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#6FD168] transition-transform"
          aria-label={tocandoEsteAlbum ? "Pausar" : "Tocar"}
          onClick={alternarAlbum}
          disabled={album.musics.length === 0}
        >
          <img
            src={tocandoEsteAlbum ? pauseIcon : playIcon}
            alt=""
            className="h-[13.5px] w-[11.5px] invert"
          />
        </button>
      </div>

      <div className="px-4 md:px-6">
        <div className="text-texto-secundario grid grid-cols-[24px_1fr_60px] gap-3 border-b border-[#2a2a2a] px-2 py-2 text-xs xl:grid-cols-[24px_1fr_140px_100px]">
          <span>#</span>
          <span>Título</span>
          <span className="hidden xl:block">Reproduções</span>
          <span className="hidden justify-center xl:flex">
            <IconeRelogio />
          </span>
        </div>

        {album.musics.map((musica, index) => (
          <AlbumSongs
            key={musica.id}
            musica={musica}
            index={index}
            aoTocar={() => tocarFaixa(filaAlbum, musica.id)}
            aoAbrirMenu={(e) =>
              setMenuFaixa({ musica, x: e.clientX, y: e.clientY })
            }
          />
        ))}
      </div>

      {menuFaixa && (
        <MenuFaixa
          musica={menuFaixa.musica}
          x={menuFaixa.x}
          y={menuFaixa.y}
          ocultarLinkAlbum
          onFechar={() => setMenuFaixa(null)}
        />
      )}
    </div>
  );
}
