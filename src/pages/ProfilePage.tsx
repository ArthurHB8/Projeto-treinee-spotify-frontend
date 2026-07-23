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
import profilePicture from "../assets/profilePicture.png";
import explicitIcon from "../assets/icons/explicitIcon.svg";

import type { Album, Artist, Music, PlaylistNoMusic } from "../api/types";
import type { FaixaFila } from "../types";
import { formatarDuracao } from "../utils/formatarDuracao";

const NOME_USUARIO = "Vitoria Tenorio";

const formatarReproducoes = (n: number) =>
  new Intl.NumberFormat("pt-BR").format(n);

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
    <div className="min-w-0 flex-1 overflow-y-auto rounded-lg bg-[#121212] pb-22 text-white">
      <div className="flex flex-row items-center gap-4 bg-linear-to-b from-[#938D8E] to-[#3E3939] pt-10 pr-10 pb-4 pl-5 xl:items-center xl:gap-6 xl:p-6">
        <img
          src={profilePicture}
          alt={NOME_USUARIO}
          className="h-15 w-15 shrink-0 rounded-full object-cover shadow-2xl xl:h-48 xl:w-48"
        />
        <div className="min-w-0">
          <p className="text-[10px] font-bold">Perfil</p>
          <h1 className="my-2 truncate text-[18px] leading-none font-black xl:text-[64px]">
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
        <p className="text-texto-secundario mb-4 text-[10px]">
          Visíveis apenas para você
        </p>

        <div className="flex gap-4 overflow-x-auto pb-1">
          {artistas.map((artista) => {
            const capa = resolveImageUrl(artista.imageUrl);
            return (
              <Link
                key={artista.id}
                to={`/artist/${artista.id}`}
                className="flex shrink-0 flex-col gap-2 rounded-sm p-1.5 text-inherit no-underline hover:bg-white/5"
              >
                {capa ? (
                  <img
                    src={capa}
                    alt={artista.name}
                    className="aspect-square w-15 rounded-full object-cover shadow-md xl:w-33"
                  />
                ) : (
                  <div
                    className="aspect-square w-15 rounded-full bg-[#2a2a2a] xl:w-33"
                    aria-hidden="true"
                  />
                )}
                <p className="truncate text-xs font-bold">{artista.name}</p>
                <p className="text-texto-secundario hidden text-[10px] lg:block">
                  Artista
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-8 px-4 md:px-6">
        <h2 className="text-[16px] font-bold">Músicas mais tocadas este mês</h2>
        <p className="text-texto-secundario mb-4 text-[10px]">
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
                      className="h-9 w-9 shrink-0 object-cover"
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
                      <img
                        src={explicitIcon}
                        alt="Explícito"
                        className="mt-0.5 h-3.5 w-3.5"
                      />
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

      <section className="px-4 md:px-6">
        <h2 className="mb-4 text-[16px] font-bold">Playlists públicas</h2>
        <div className="flex gap-3 overflow-x-auto">
          {playlists.map((playlist) => {
            const capa = resolveImageUrl(playlist.imageUrl);
            return (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="flex shrink-0 flex-col items-start gap-2 rounded-sm text-inherit no-underline hover:bg-white/5"
              >
                {capa ? (
                  <img
                    src={capa}
                    alt={playlist.name}
                    className="aspect-square w-33 rounded-sm object-cover shadow-md"
                  />
                ) : (
                  <div
                    className="aspect-square w-33 rounded-sm bg-[#2a2a2a]"
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
