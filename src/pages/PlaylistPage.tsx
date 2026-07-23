import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSortable } from "@dnd-kit/react/sortable";
import { useDragDropMonitor } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

import { reorderPlaylist } from "../api/playlist";
import { getAlbumById } from "../api/album";
import { getArtistById } from "../api/artist";
import { resolveImageUrl } from "../api/client";
import { getPlaylistById } from "../api/playlist";
import { usePlayer } from "../context/PlayerContext";

import MenuFaixa from "../components/MenuFaixa";
import EstadoPagina from "../components/EstadoPagina";
import pauseIcon from "../assets/icons/pauseIcon.svg";
import playIcon from "../assets/icons/playIcon.svg";
import profilePicture from "../assets/profilePicture.png";

import type { Album, Artist, Music, Playlist } from "../api/types";
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

const formatarData = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

const formatarMinutosTotais = (segundos: number) =>
  `${Math.round(segundos / 60)} min`;

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

type PlaylistSongRow = {
  musica: Music;
  index: number;
  groupId: string;
  album?: Album;
  artista?: Artist;
  aoTocar: () => void;
  aoAbrirMenu: (e: React.MouseEvent) => void;
};

const PlaylistRow = ({
  musica,
  index,
  groupId,
  album,
  artista,
  aoTocar,
  aoAbrirMenu,
}: PlaylistSongRow) => {
  const { ref } = useSortable({
    id: musica.id,
    index,
    group: groupId,
    type: "song",
    accept: "song",
  });

  const capaFaixa = resolveImageUrl(album?.imageUrl ?? null);

  return (
    <div
      ref={ref}
      onClick={aoTocar}
      onContextMenu={(e) => {
        e.preventDefault();
        aoAbrirMenu(e);
      }}
      className="group grid cursor-pointer grid-cols-[24px_1fr_60px] items-center gap-3 rounded-sm px-2 py-2 text-xs hover:bg-white/10 md:grid-cols-[24px_1fr_200px_140px_100px]"
    >
      <span className="text-texto-secundario">{index + 1}</span>
      <div className="flex min-w-0 items-center gap-3">
        {capaFaixa ? (
          <img
            src={capaFaixa}
            alt={musica.title}
            className="h-10 w-10 shrink-0 object-cover"
          />
        ) : (
          <div className="h-10 w-10 shrink-0 bg-[#2a2a2a]" aria-hidden="true" />
        )}
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate font-medium">{musica.title}</p>
          <p className="text-texto-secundario truncate">{artista?.name}</p>
        </div>
      </div>
      <span className="text-texto-secundario hidden truncate md:block">
        {album?.title}
      </span>
      <span className="text-texto-secundario hidden md:block">
        {formatarData(musica.createdAt)}
      </span>
      <div className="text-texto-secundario item-center flex justify-end gap-3">
        <span>{formatarDuracao(musica.duration)}</span>
        <button
          className="hidden cursor-pointer opacity-0 group-hover:opacity-100 md:block"
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

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const { faixaAtual, tocando, tocarFaixa, alternarPlayPause } = usePlayer();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [albunsPorId, setAlbunsPorId] = useState<Map<string, Album>>(new Map());
  const [artistasPorId, setArtistasPorId] = useState<Map<string, Artist>>(
    new Map(),
  );
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

    const carregar = async () => {
      const playlistResp = await getPlaylistById(id);
      setPlaylist(playlistResp);

      const albumIds = [
        ...new Set(playlistResp.musics.map((musica) => musica.albumId)),
      ];
      const artistIds = [
        ...new Set(playlistResp.musics.map((musica) => musica.artistId)),
      ];

      const [albunsResp, artistasResp] = await Promise.all([
        Promise.all(albumIds.map((albumId) => getAlbumById(albumId))),
        Promise.all(artistIds.map((artistId) => getArtistById(artistId))),
      ]);

      setAlbunsPorId(new Map(albunsResp.map((album) => [album.id, album])));
      setArtistasPorId(
        new Map(artistasResp.map((artista) => [artista.id, artista])),
      );
    };

    carregar()
      .catch(() => setErro("Não foi possível carregar a playlist."))
      .finally(() => setCarregando(false));
  }, [id]);

  const recarregarAposRemocao = () => {
    if (id) getPlaylistById(id).then(setPlaylist);
  };

  useDragDropMonitor({
    onDragOver(event) {
      if (event.operation.target?.type !== "song") return;

      setPlaylist((atual) => {
        if (!atual) return atual;
        return { ...atual, musics: move(atual.musics, event) };
      });
    },

    onDragEnd(event) {
      if (event.canceled || !playlist) return;

      if (event.operation.target?.type === "song") {
        const musicIds = playlist.musics.map((musica) => musica.id);

        reorderPlaylist(playlist.id, musicIds).catch(() =>
          recarregarAposRemocao(),
        );
      } else {
        recarregarAposRemocao();
      }
    },
  });
  useAdicionarMusicaPlaylist(playlist?.id);

  if (carregando) return <EstadoPagina>Carregando playlist...</EstadoPagina>;
  if (erro)
    return (
      <EstadoPagina>
        <p className="text-red-400">{erro}</p>
      </EstadoPagina>
    );
  if (!playlist) return <EstadoPagina>Playlist não encontrada.</EstadoPagina>;

  const capaPlaylist = resolveImageUrl(playlist.imageUrl);

  const filaPlaylist: FaixaFila[] = playlist.musics.map((musica) => ({
    musica,
    capa: albunsPorId.get(musica.albumId)?.imageUrl ?? null,
    nomeArtista: artistasPorId.get(musica.artistId)?.name ?? "",
  }));

  const faixaAtualEDestaPlaylist =
    !!faixaAtual &&
    filaPlaylist.some((item) => item.musica.id === faixaAtual.musica.id);
  const tocandoEstaPlaylist = tocando && faixaAtualEDestaPlaylist;

  const alternarPlaylist = () => {
    if (faixaAtualEDestaPlaylist) {
      alternarPlayPause();
    } else if (playlist.musics[0]) {
      tocarFaixa(filaPlaylist, playlist.musics[0].id);
    }
  };

  return (
    <div className="min-w-0 flex-1 overflow-y-auto rounded-lg bg-[#121212] pb-22 text-white">
      <div className="flex flex-col items-start gap-4 bg-linear-to-b from-[#938D8E] to-[#3E3939] p-4 md:flex-row md:items-end md:gap-6 md:p-6">
        {capaPlaylist ? (
          <img
            src={capaPlaylist}
            alt={playlist.name}
            className="h-30 w-30 shrink-0 object-cover md:h-[174px] md:w-[174px]"
          />
        ) : (
          <div
            className="flex h-[120px] w-[120px] shrink-0 items-center justify-center bg-[#2a2a2a] text-4xl font-bold md:h-[174px] md:w-[174px] md:text-6xl"
            aria-hidden="true"
          >
            {playlist.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-bold">Playlist pública</p>
          <h1 className="my-2 truncate text-[28px] leading-none font-bold md:text-[64px]">
            {playlist.name}
          </h1>
          {playlist.description && (
            <p className="text-texto-secundario mb-2 line-clamp-2 text-[10px]">
              {playlist.description}
            </p>
          )}
          <div className="flex items-center gap-1.5 text-[10px]">
            <img
              src={profilePicture}
              alt=""
              className="h-4 w-4 rounded-full object-cover"
            />
            <span className="font-bold">Vitoria Tenorio</span>
            <span className="text-texto-secundario">
              • {playlist.musicQtd} músicas,{" "}
              {formatarDuracaoTotal(playlist.duration)} (
              {formatarMinutosTotais(playlist.duration)})
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 md:px-6">
        <button
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#6FD168] transition-transform"
          aria-label={tocandoEstaPlaylist ? "Pausar" : "Tocar"}
          onClick={alternarPlaylist}
          disabled={playlist.musics.length === 0}
        >
          <img
            src={tocandoEstaPlaylist ? pauseIcon : playIcon}
            alt=""
            className="h-[13.5px] w-[11.5px] invert"
          />
        </button>
      </div>

      <div className="px-4 md:px-6">
        <div className="text-texto-secundario grid grid-cols-[24px_1fr_60px] gap-3 border-b border-[#2a2a2a] px-2 py-2 text-xs md:grid-cols-[24px_1fr_200px_140px_100px]">
          <span>#</span>
          <span>Título</span>
          <span className="hidden md:block">Álbum</span>
          <span className="hidden md:block">Adicionada em</span>
          <span className="hidden justify-center md:flex">
            <IconeRelogio />
          </span>
        </div>

        {playlist.musics.map((musica, index) => (
          <PlaylistRow
            key={musica.id}
            musica={musica}
            index={index}
            groupId={playlist.id}
            album={albunsPorId.get(musica.albumId)}
            artista={artistasPorId.get(musica.artistId)}
            aoTocar={() => tocarFaixa(filaPlaylist, musica.id)}
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
          playlistIdAtual={playlist.id}
          onFechar={() => setMenuFaixa(null)}
          onFaixaRemovida={recarregarAposRemocao}
        />
      )}
    </div>
  );
}
