import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDraggable } from "@dnd-kit/react";

import {
  getAlbumsByArtistId,
  getArtistById,
  getPopularMusicsByArtistId,
} from "../api/artist";
import { resolveImageUrl } from "../api/client";
import { usePlayer } from "../context/PlayerContext";
import MenuFaixa from "../components/MenuFaixa";
import EstadoPagina from "../components/EstadoPagina";
import verifiedIcon from "../assets/icons/verifiedIcon.svg";
import inLibraryIcon from "../assets/icons/inLibraryIcon.svg";
import playIcon from "../assets/icons/playIcon.svg";
import pauseIcon from "../assets/icons/pauseIcon.svg";
import type { Album, Artist, Music } from "../api/types";
import type { FaixaFila } from "../types";
import { useAdicionarMusicaPlaylist } from "../hooks/useAdicionarMusicaPlaylist";

const formatarOuvintes = (n: number) =>
  new Intl.NumberFormat("pt-BR").format(n);

const formatarDuracao = (segundos: number) => {
  const minutos = Math.floor(segundos / 60);
  const restante = segundos % 60;
  return `${minutos}:${String(restante).padStart(2, "0")}`;
};

type ArtistSongRow = {
  musica: Music;
  index: number;
  capaMusica: string | null;
  aoTocar: () => void;
  aoAbrirMenu: (e: React.MouseEvent) => void;
};

const ArtistSong = ({
  musica,
  index,
  capaMusica,
  aoTocar,
  aoAbrirMenu,
}: ArtistSongRow) => {
  const { ref } = useDraggable({ id: musica.id, type: "song" });

  return (
    <div
      ref={ref}
      onClick={aoTocar}
      onContextMenu={(e) => {
        e.preventDefault();
        aoAbrirMenu(e);
      }}
      className="grid cursor-pointer grid-cols-[24px_1fr_auto] items-center gap-2.5 rounded-sm px-2 py-2 hover:bg-white/10"
    >
      <span className="text-texto-secundario text-center text-sm">
        {index + 1}
      </span>
      <div className="flex min-w-0 items-center gap-3">
        {capaMusica ? (
          <img
            src={capaMusica}
            alt={musica.title}
            className="h-10 w-10 shrink-0 object-cover"
          />
        ) : (
          <div className="h-10 w-10 shrink-0 bg-[#2a2a2a]" aria-hidden="true" />
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{musica.title}</p>
          {musica.explicit && (
            <span className="bg-texto-secundario mt-0.5 inline-block rounded-xs px-1 text-[9px] leading-tight font-bold text-black">
              E
            </span>
          )}
        </div>
      </div>
      <div className="text-texto-secundario flex items-center gap-2.5 text-xs">
        <span>{formatarOuvintes(musica.timesListen)}</span>
        {musica.playlistsId.length > 0 && (
          <img
            src={inLibraryIcon}
            alt="Na sua biblioteca"
            className="h-3.5 w-3.5"
          />
        )}
        <span>{formatarDuracao(musica.duration)}</span>
      </div>
    </div>
  );
};

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const { faixaAtual, tocando, tocarFaixa, alternarPlayPause } = usePlayer();
  const [menuFaixa, setMenuFaixa] = useState<{
    musica: Music;
    x: number;
    y: number;
  } | null>(null);

  const [artista, setArtista] = useState<Artist | null>(null);
  const [albuns, setAlbuns] = useState<Album[]>([]);
  const [musicasPopulares, setMusicasPopulares] = useState<Music[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

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

  useAdicionarMusicaPlaylist();

  if (carregando) return <EstadoPagina>Carregando artista...</EstadoPagina>;
  if (erro)
    return (
      <EstadoPagina>
        <p className="text-red-400">{erro}</p>
      </EstadoPagina>
    );
  if (!artista) return <EstadoPagina>Artista não encontrado.</EstadoPagina>;

  const capaPorMusica = new Map<string, string | null>();
  albuns.forEach((album) => {
    album.musics.forEach((musica) =>
      capaPorMusica.set(musica.id, album.imageUrl),
    );
  });

  const capaArtista = resolveImageUrl(artista.imageUrl);

  const filaPopulares: FaixaFila[] = musicasPopulares.map((musica) => ({
    musica,
    capa: capaPorMusica.get(musica.id) ?? null,
    nomeArtista: artista.name,
  }));

  const faixaAtualEDesteArtista =
    !!faixaAtual &&
    filaPopulares.some((item) => item.musica.id === faixaAtual.musica.id);
  const tocandoEsteArtista = tocando && faixaAtualEDesteArtista;

  const alternarArtista = () => {
    if (faixaAtualEDesteArtista) {
      alternarPlayPause();
    } else if (musicasPopulares[0]) {
      tocarFaixa(filaPopulares, musicasPopulares[0].id);
    }
  };

  return (
    <div className="max-h-[calc(100vh-63px)] min-w-0 flex-1 overflow-y-auto rounded-lg bg-[#121212] pb-[88px] text-white">
      <div className="relative flex h-[220px] items-end bg-gradient-to-b from-[#5f5f5f] to-[#121212] p-4 md:h-[380px] md:p-6">
        {capaArtista && (
          <img
            src={capaArtista}
            alt={artista.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0" />
        <div className="relative z-10 min-w-0">
          <h1 className="mb-4 truncate text-[28px] leading-none font-bold md:text-[64px]">
            {artista.name}
          </h1>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium">
            <img src={verifiedIcon} alt="" className="h-4 w-4" />
            Verificado pelo Spotify
          </div>
          <p className="text-xs">
            {formatarOuvintes(artista.listeners)} ouvintes mensais
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-4 py-6 md:px-6">
        <button
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#6FD168] transition-transform"
          aria-label={tocandoEsteArtista ? "Pausar" : "Tocar"}
          onClick={alternarArtista}
          disabled={musicasPopulares.length === 0}
        >
          <img
            src={tocandoEsteArtista ? pauseIcon : playIcon}
            alt=""
            className="h-[13.5px] w-[11.5px] invert"
          />
        </button>
        <button className="cursor-pointer rounded-full border border-[#7c7c7c] px-3 py-1.5 text-xs font-bold hover:border-white">
          Seguir
        </button>
      </div>

      <section className="mb-8 px-4 md:px-6">
        <h2 className="mb-4 text-[16px] font-bold">Populares</h2>
        <div className="flex flex-col">
          {musicasPopulares.map((musica, index) => (
            <ArtistSong
              key={musica.id}
              musica={musica}
              index={index}
              capaMusica={resolveImageUrl(capaPorMusica.get(musica.id) ?? null)}
              aoTocar={() => tocarFaixa(filaPopulares, musica.id)}
              aoAbrirMenu={(e) =>
                setMenuFaixa({ musica, x: e.clientX, y: e.clientY })
              }
            />
          ))}
        </div>
        <button className="text-texto-secundario mt-2 cursor-pointer text-xs hover:text-white">
          Mostrar tudo
        </button>
      </section>

      <section className="px-4 pb-8 md:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold">Discografia</h2>
          <button className="text-texto-secundario cursor-pointer text-xs hover:text-white">
            Mostrar tudo
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {albuns.map((album) => {
            const capaAlbum = resolveImageUrl(album.imageUrl);

            return (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
                className="flex flex-col gap-2 rounded-sm p-2 text-inherit no-underline hover:bg-white/5"
              >
                {capaAlbum ? (
                  <img
                    src={capaAlbum}
                    alt={album.title}
                    className="aspect-square w-full rounded-md object-cover shadow-md"
                  />
                ) : (
                  <div
                    className="aspect-square w-full rounded-md bg-[#2a2a2a]"
                    aria-hidden="true"
                  />
                )}
                <p className="truncate text-sm font-medium">{album.title}</p>
                <p className="text-texto-secundario text-xs">{album.year}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {artista.about && (
        <section className="px-4 pb-8 md:px-6">
          <h2 className="mb-4 text-[16px] font-bold">Sobre</h2>
          <p className="text-texto-secundario max-w-[720px] text-sm">
            {artista.about}
          </p>
        </section>
      )}

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
