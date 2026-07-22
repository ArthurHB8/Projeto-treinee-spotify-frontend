import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAlbumById } from "../api/album";
import { resolveImageUrl } from "../api/client";
import {
  getUserFollowers,
  getUserMostPlayedArtists,
  getUserMostPlayedMusics,
  getUserPlaylists,
} from "../api/user";
import { usePlayer } from "../context/PlayerContext";
import EstadoPagina from "../components/EstadoPagina";
import MenuFaixa from "../components/MenuFaixa";
import profilePicture from "../assets/profilePicture.jpg";
import type { Album, Artist, Music, PlaylistNoMusic } from "../api/types";
import type { FaixaFila } from "../types";

const NOME_USUARIO = "Vitoria Tenorio";

const formatarReproducoes = (n: number) =>
  new Intl.NumberFormat("pt-BR").format(n);

const formatarDuracao = (segundos: number) => {
  const minutos = Math.floor(segundos / 60);
  const restante = segundos % 60;
  return `${minutos}:${String(restante).padStart(2, "0")}`;
};

export default function ProfilePage() {
  const { tocarFaixa } = usePlayer();

  const [artistas, setArtistas] = useState<Artist[]>([]);
  const [musicas, setMusicas] = useState<Music[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistNoMusic[]>([]);
  const [seguidores, setSeguidores] = useState<string[]>([]);
  const [albunsPorId, setAlbunsPorId] = useState<Map<string, Album>>(new Map());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [menuFaixa, setMenuFaixa] = useState<{
    musica: Music;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    setCarregando(true);
    setErro(null);

    const carregar = async () => {
      const [artistasResp, musicasResp, playlistsResp, seguidoresResp] =
        await Promise.all([
          getUserMostPlayedArtists(),
          getUserMostPlayedMusics(),
          getUserPlaylists(),
          getUserFollowers(),
        ]);

      setArtistas(artistasResp);
      setMusicas(musicasResp);
      setPlaylists(playlistsResp);
      setSeguidores(seguidoresResp);

      const albumIds = [
        ...new Set(
          musicasResp
            .map((musica) => musica.albumId)
            .filter((albumId): albumId is string => Boolean(albumId)),
        ),
      ];
      const albunsResp = await Promise.all(
        albumIds.map((albumId) => getAlbumById(albumId)),
      );
      setAlbunsPorId(new Map(albunsResp.map((album) => [album.id, album])));
    };

    carregar()
      .catch(() => setErro("Não foi possível carregar o perfil."))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <EstadoPagina>Carregando perfil...</EstadoPagina>;
  if (erro)
    return (
      <EstadoPagina>
        <p className="text-red-400">{erro}</p>
      </EstadoPagina>
    );

  const filaMusicas: FaixaFila[] = musicas.map((musica) => ({
    musica,
    capa: albunsPorId.get(musica.albumId)?.imageUrl ?? null,
    nomeArtista: artistas.find((a) => a.id === musica.artistId)?.name ?? "",
  }));

  return (
    <div className="max-h-[calc(100vh-63px)] min-w-0 flex-1 overflow-y-auto rounded-lg bg-[#121212] pb-[88px] text-white">
      <div className="flex flex-col items-start gap-4 bg-gradient-to-b from-[#5f5f5f] to-[#121212] p-4 xl:flex-row xl:items-end xl:gap-6 xl:p-6">
        <img
          src={profilePicture}
          alt={NOME_USUARIO}
          className="h-[120px] w-[120px] shrink-0 rounded-full object-cover shadow-2xl xl:h-[192px] xl:w-[192px]"
        />
        <div className="min-w-0">
          <p className="text-xs font-bold">Perfil</p>
          <h1 className="my-2 truncate text-[28px] leading-none font-black xl:text-[64px]">
            {NOME_USUARIO}
          </h1>
          <p className="text-texto-secundario text-[10px]">
            {`${playlists.length} playlists públicas • ${seguidores.length} seguidores`}
          </p>
        </div>
      </div>

      <section className="mb-8 px-4 pt-6 md:px-6">
        <h2 className="text-[16px] font-bold">
          Artistas mais tocados este mês
        </h2>
        <p className="text-texto-secundario mb-4 text-xs">
          Visíveis apenas para você
        </p>
        <div className="flex gap-4 overflow-x-auto pb-1">
          {artistas.map((artista) => {
            const capa = resolveImageUrl(artista.imageUrl);
            return (
              <Link
                key={artista.id}
                to={`/artist/${artista.id}`}
                className="flex w-[120px] shrink-0 flex-col gap-2 rounded-sm p-1.5 text-inherit no-underline hover:bg-white/5"
              >
                {capa ? (
                  <img
                    src={capa}
                    alt={artista.name}
                    className="aspect-square w-full rounded-full object-cover shadow-md"
                  />
                ) : (
                  <div
                    className="aspect-square w-full rounded-full bg-[#2a2a2a]"
                    aria-hidden="true"
                  />
                )}
                <p className="truncate text-xs font-bold">{artista.name}</p>
                <p className="text-texto-secundario text-[10px]">Artista</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-8 px-4 md:px-6">
        <h2 className="text-[16px] font-bold">Músicas mais tocadas este mês</h2>
        <p className="text-texto-secundario mb-4 text-xs">
          Visíveis apenas para você
        </p>
        <div className="flex flex-col">
          {musicas.map((musica, index) => {
            const capa = resolveImageUrl(
              albunsPorId.get(musica.albumId)?.imageUrl ?? null,
            );

            return (
              <div
                key={musica.id}
                onClick={() => tocarFaixa(filaMusicas, musica.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setMenuFaixa({ musica, x: e.clientX, y: e.clientY });
                }}
                className="grid cursor-pointer grid-cols-[24px_1fr_auto] items-center gap-2.5 rounded-sm px-2 py-2 hover:bg-white/10"
              >
                <span className="text-texto-secundario text-center text-sm">
                  {index + 1}
                </span>
                <div className="flex min-w-0 items-center gap-3">
                  {capa ? (
                    <img
                      src={capa}
                      alt={musica.title}
                      className="h-10 w-10 shrink-0 object-cover"
                    />
                  ) : (
                    <div
                      className="h-10 w-10 shrink-0 bg-[#2a2a2a]"
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {musica.title}
                    </p>
                    {musica.explicit && (
                      <span className="bg-texto-secundario mt-0.5 inline-block rounded-xs px-1 text-[9px] leading-tight font-bold text-black">
                        E
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-texto-secundario flex items-center gap-3 text-xs">
                  <span>{formatarReproducoes(musica.timesListen)}</span>
                  <span>{formatarDuracao(musica.duration)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-8 md:px-6">
        <h2 className="mb-4 text-[16px] font-bold">Playlists públicas</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {playlists.map((playlist) => {
            const capa = resolveImageUrl(playlist.imageUrl);
            return (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="flex flex-col gap-2 rounded-sm p-2 text-inherit no-underline hover:bg-white/5"
              >
                {capa ? (
                  <img
                    src={capa}
                    alt={playlist.name}
                    className="aspect-square w-full rounded-sm object-cover shadow-md"
                  />
                ) : (
                  <div
                    className="aspect-square w-full rounded-sm bg-[#2a2a2a]"
                    aria-hidden="true"
                  />
                )}
                <p className="truncate text-xs font-bold">{playlist.name}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {menuFaixa && (
        <MenuFaixa
          musica={menuFaixa.musica}
          x={menuFaixa.x}
          y={menuFaixa.y}
          onFechar={() => setMenuFaixa(null)}
        />
      )}
    </div>
  );
}
