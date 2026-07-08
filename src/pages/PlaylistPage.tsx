import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getAlbumById } from "../api/album";
import { getArtistById } from "../api/artist";
import { resolveImageUrl } from "../api/client";
import { getPlaylistById } from "../api/playlist";
import { usePlayer } from "../context/PlayerContext";
import MenuFaixa from "../components/MenuFaixa";
import pauseIcon from "../assets/icons/pauseIcon.svg";
import playIcon from "../assets/icons/playIcon.svg";
import profilePicture from "../assets/profilePicture.jpg";
import type { Album, Artist, Music, Playlist } from "../api/types";
import type { FaixaFila } from "../types";

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

const formatarMinutosTotais = (segundos: number) => `${Math.round(segundos / 60)} min`;

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
  const [menuFaixa, setMenuFaixa] = useState<{ musica: Music; x: number; y: number } | null>(
    null,
  );

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

  if (carregando)
    return <p className="text-white p-4">Carregando playlist...</p>;
  if (erro) return <p className="text-red-400 p-4">{erro}</p>;
  if (!playlist) return null;

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
    <div className="text-white bg-[#121212] rounded-lg flex-1 min-w-0 max-h-195 overflow-y-auto pb-[88px]">
      <div className="flex items-end gap-6 p-6 bg-gradient-to-b from-[#5f5f5f] to-[#121212]">
        {capaPlaylist ? (
          <img
            src={capaPlaylist}
            alt={playlist.name}
            className="w-[192px] h-[192px] object-cover shadow-2xl shrink-0"
          />
        ) : (
          <div
            className="w-[192px] h-[192px] bg-[#2a2a2a] shrink-0"
            aria-hidden="true"
          />
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold">Playlist pública</p>
          <h1 className="text-[64px] font-bold leading-none my-2 truncate">
            {playlist.name}
          </h1>
          <div className="flex items-center gap-1.5 text-[10px]">
            <img
              src={profilePicture}
              alt=""
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="font-bold">Arthur</span>
            <span className="text-texto-secundario">
              • {playlist.musicQtd} músicas,{" "}
              {formatarDuracaoTotal(playlist.duration)} (
              {formatarMinutosTotais(playlist.duration)})
            </span>
          </div>
          <p className="text-[10px] text-texto-secundario mt-1">
            Criada em {formatarData(playlist.createdAt)}
            {playlist.updatedAt &&
              ` • Última modificação em ${formatarData(playlist.updatedAt)}`}
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        <button
          className="w-9 h-9 rounded-full bg-[#6FD168] flex items-center justify-center cursor-pointer transition-transform"
          aria-label={tocandoEstaPlaylist ? "Pausar" : "Tocar"}
          onClick={alternarPlaylist}
          disabled={playlist.musics.length === 0}
        >
          <img
            src={tocandoEstaPlaylist ? pauseIcon : playIcon}
            alt=""
            className="w-[11.5px] h-[13.5px] invert"
          />
        </button>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-[24px_1fr_200px_140px_100px] gap-3 px-2 py-2 border-b border-[#2a2a2a] text-xs text-texto-secundario">
          <span>#</span>
          <span>Título</span>
          <span>Álbum</span>
          <span>Adicionada em</span>
          <span className="flex justify-center">
            <IconeRelogio />
          </span>
        </div>

        {playlist.musics.map((musica, index) => {
          const album = albunsPorId.get(musica.albumId);
          const artista = artistasPorId.get(musica.artistId);
          const capaFaixa = resolveImageUrl(album?.imageUrl ?? null);

          return (
            <div
              key={musica.id}
              onClick={() => tocarFaixa(filaPlaylist, musica.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setMenuFaixa({ musica, x: e.clientX, y: e.clientY });
              }}
              className="grid grid-cols-[24px_1fr_200px_140px_100px] gap-3 items-center px-2 py-2 rounded-sm hover:bg-white/10 cursor-pointer group text-xs"
            >
              <span className="text-texto-secundario">{index + 1}</span>
              <div className="flex items-center gap-3 min-w-0">
                {capaFaixa ? (
                  <img
                    src={capaFaixa}
                    alt={musica.title}
                    className="w-10 h-10 object-cover shrink-0"
                  />
                ) : (
                  <div
                    className="w-10 h-10 bg-[#2a2a2a] shrink-0"
                    aria-hidden="true"
                  />
                )}
                <div className="min-w-0 flex flex-col gap-1">
                  <p className="font-medium truncate">{musica.title}</p>
                  <p className="text-texto-secundario truncate">
                    {artista?.name}
                  </p>
                </div>
              </div>
              <span className=" text-texto-secundario truncate">
                {album?.title}
              </span>
              <span className="text-texto-secundario">
                {formatarData(musica.createdAt)}
              </span>
              <div className="flex items-center justify-end gap-3 text-texto-secundario">
                <span>{formatarDuracao(musica.duration)}</span>
                <button
                  className="opacity-0 group-hover:opacity-100 cursor-pointer"
                  aria-label="Mais opções"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuFaixa({ musica, x: e.clientX, y: e.clientY });
                  }}
                >
                  <IconeMais />
                </button>
              </div>
            </div>
          );
        })}
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
