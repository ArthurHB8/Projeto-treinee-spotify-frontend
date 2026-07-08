import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getAlbumsByArtistId,
  getArtistById,
  getPopularMusicsByArtistId,
} from "../api/artist";
import { resolveImageUrl } from "../api/client";
import verifiedIcon from "../assets/icons/verifiedIcon.svg";
import inLibraryIcon from "../assets/icons/inLibraryIcon.svg";
import playIcon from "../assets/icons/playIcon.svg";
import pauseIcon from "../assets/icons/pauseIcon.svg";
import type { Album, Artist, Music } from "../api/types";

const formatarOuvintes = (n: number) =>
  new Intl.NumberFormat("pt-BR").format(n);

const formatarDuracao = (segundos: number) => {
  const minutos = Math.floor(segundos / 60);
  const restante = segundos % 60;
  return `${minutos}:${String(restante).padStart(2, "0")}`;
};

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();

  const [artista, setArtista] = useState<Artist | null>(null);
  const [albuns, setAlbuns] = useState<Album[]>([]);
  const [musicasPopulares, setMusicasPopulares] = useState<Music[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [tocando, setTocando] = useState(false);

  useEffect(() => {
    if (!id) return;

    setCarregando(true);
    setErro(null);

    Promise.all([
      getArtistById(id),
      getAlbumsByArtistId(id),
      getPopularMusicsByArtistId(id),
    ])
      .then(([artistaResp, albunsResp, musicasResp]) => {
        setArtista(artistaResp);
        setAlbuns(albunsResp);
        setMusicasPopulares(musicasResp);
      })
      .catch(() => setErro("Não foi possível carregar os dados do artista."))
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando)
    return <p className="text-white p-4">Carregando artista...</p>;
  if (erro) return <p className="text-red-400 p-4">{erro}</p>;
  if (!artista) return null;

  const capaPorMusica = new Map<string, string | null>();
  albuns.forEach((album) => {
    album.musics.forEach((musica) =>
      capaPorMusica.set(musica.id, album.imageUrl),
    );
  });

  const capaArtista = resolveImageUrl(artista.imageUrl);

  return (
    <div className="text-white bg-[#121212] rounded-lg flex-1 min-w-0 max-h-[927px] overflow-y-auto">
      <div className="relative h-[380px] flex items-end p-6 bg-gradient-to-b from-[#5f5f5f] to-[#121212]">
        {capaArtista && (
          <img
            src={capaArtista}
            alt={artista.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/10 to-transparent" />
        <div className="relative z-10">
          <h1 className="text-[64px] font-bold leading-none mb-4">
            {artista.name}
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-medium mb-1.5 text-xs">
            <img src={verifiedIcon} alt="" className="w-4 h-4" />
            Verificado pelo Spotify
          </div>
          <p className="text-xs">
            {formatarOuvintes(artista.listeners)} ouvintes mensais
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-6 py-6">
        <button
          className="w-9 h-9 rounded-full bg-[#6FD168] flex items-center justify-center cursor-pointer transition-transform"
          aria-label={tocando ? "Pausar" : "Tocar"}
          onClick={() => setTocando((atual) => !atual)}
        >
          <img
            src={tocando ? pauseIcon : playIcon}
            alt=""
            className="w-[11.5px] h-[13.5px]"
          />
        </button>
        <button className="border border-[#7c7c7c] rounded-full px-3 py-1.5 text-xs font-bold cursor-pointer hover:border-white">
          Seguir
        </button>
      </div>

      <section className="px-6 mb-8">
        <h2 className="text-[16px] font-bold mb-4">Populares</h2>
        <div className="flex flex-col">
          {musicasPopulares.map((musica, index) => {
            const capaMusica = resolveImageUrl(
              capaPorMusica.get(musica.id) ?? null,
            );

            return (
              <div
                key={musica.id}
                className="grid grid-cols-[24px_1fr_auto] items-center gap-2.5 px-2 py-2 rounded-sm hover:bg-white/10 cursor-pointer"
              >
                <span className="text-sm text-texto-secundario text-center">
                  {index + 1}
                </span>
                <div className="flex items-center gap-3 min-w-0">
                  {capaMusica ? (
                    <img
                      src={capaMusica}
                      alt={musica.title}
                      className="w-10 h-10 object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 bg-[#2a2a2a] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {musica.title}
                    </p>
                    {musica.explicit && (
                      <span className="inline-block text-[9px] font-bold bg-texto-secundario text-black px-1 leading-tight rounded-xs mt-0.5">
                        E
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-texto-secundario">
                  <span>{formatarOuvintes(musica.timesListen)}</span>
                  {musica.playlistsId.length > 0 && (
                    <img
                      src={inLibraryIcon}
                      alt="Na sua biblioteca"
                      className="w-3.5 h-3.5"
                    />
                  )}
                  <span>{formatarDuracao(musica.duration)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <button className="text-xs text-texto-secundario hover:text-white cursor-pointer mt-2">
          Mostrar tudo
        </button>
      </section>

      <section className="px-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold">Discografia</h2>
          <button className="text-xs text-texto-secundario hover:text-white cursor-pointer">
            Mostrar tudo
          </button>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {albuns.map((album) => {
            const capaAlbum = resolveImageUrl(album.imageUrl);

            return (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
                className="flex flex-col gap-2 p-2 rounded-sm hover:bg-white/5 no-underline text-inherit"
              >
                {capaAlbum ? (
                  <img
                    src={capaAlbum}
                    alt={album.title}
                    className="w-full aspect-square object-cover rounded-md shadow-md"
                  />
                ) : (
                  <div
                    className="w-full aspect-square bg-[#2a2a2a] rounded-md"
                    aria-hidden="true"
                  />
                )}
                <p className="text-sm font-medium truncate">{album.title}</p>
                <p className="text-xs text-texto-secundario">{album.year}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
