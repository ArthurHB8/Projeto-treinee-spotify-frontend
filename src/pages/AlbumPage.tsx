import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getAlbumById } from "../api/album";
import { resolveImageUrl } from "../api/client";
import { usePlayer } from "../context/PlayerContext";
import MenuFaixa from "../components/MenuFaixa";
import EstadoPagina from "../components/EstadoPagina";
import pauseIcon from "../assets/icons/pauseIcon.svg";
import playIcon from "../assets/icons/playIcon.svg";
import type { Album, Music } from "../api/types";
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

const formatarReproducoes = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

const IconeRelogio = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconeMais = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);

export default function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const { faixaAtual, tocando, tocarFaixa, alternarPlayPause } = usePlayer();

  const [album, setAlbum] = useState<Album | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [menuFaixa, setMenuFaixa] = useState<{ musica: Music; x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    if (!id) return;

    setCarregando(true);
    setErro(null);

    getAlbumById(id)
      .then(setAlbum)
      .catch(() => setErro("Não foi possível carregar o álbum."))
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) return <EstadoPagina>Carregando álbum...</EstadoPagina>;
  if (erro) return <EstadoPagina><p className="text-red-400">{erro}</p></EstadoPagina>;
  if (!album) return <EstadoPagina>Álbum não encontrado.</EstadoPagina>;

  const capaAlbum = resolveImageUrl(album.imageUrl);

  const filaAlbum: FaixaFila[] = album.musics.map((musica) => ({
    musica,
    capa: album.imageUrl,
    nomeArtista: album.artistName,
  }));

  const faixaAtualEDesteAlbum =
    !!faixaAtual && filaAlbum.some((item) => item.musica.id === faixaAtual.musica.id);
  const tocandoEsteAlbum = tocando && faixaAtualEDesteAlbum;

  const alternarAlbum = () => {
    if (faixaAtualEDesteAlbum) {
      alternarPlayPause();
    } else if (album.musics[0]) {
      tocarFaixa(filaAlbum, album.musics[0].id);
    }
  };

  return (
    <div className="text-white bg-[#121212] rounded-lg flex-1 min-w-0 max-h-195 overflow-y-auto pb-[88px]">
      <div className="flex items-end gap-6 p-6 bg-gradient-to-b from-[#5f5f5f] to-[#121212]">
        {capaAlbum ? (
          <img
            src={capaAlbum}
            alt={album.title}
            className="w-[192px] h-[192px] object-cover shadow-2xl shrink-0"
          />
        ) : (
          <div className="w-[192px] h-[192px] bg-[#2a2a2a] shrink-0" aria-hidden="true" />
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold">Álbum</p>
          <h1 className="text-[64px] font-bold leading-none my-2 truncate">{album.title}</h1>
          <div className="flex items-center gap-1.5 text-[10px]">
            <Link to={`/artist/${album.artistId}`} className="font-bold hover:underline">
              {album.artistName}
            </Link>
            <span className="text-texto-secundario">
              • {album.year} • {album.musics.length} músicas,{" "}
              {formatarDuracaoTotal(album.musics.reduce((total, m) => total + m.duration, 0))}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <button
          className="w-9 h-9 rounded-full bg-[#6FD168] flex items-center justify-center cursor-pointer transition-transform"
          aria-label={tocandoEsteAlbum ? "Pausar" : "Tocar"}
          onClick={alternarAlbum}
          disabled={album.musics.length === 0}
        >
          <img
            src={tocandoEsteAlbum ? pauseIcon : playIcon}
            alt=""
            className="w-[11.5px] h-[13.5px] invert"
          />
        </button>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-[24px_1fr_140px_100px] gap-3 px-2 py-2 border-b border-[#2a2a2a] text-xs text-texto-secundario">
          <span>#</span>
          <span>Título</span>
          <span>Reproduções</span>
          <span className="flex justify-center">
            <IconeRelogio />
          </span>
        </div>

        {album.musics.map((musica, index) => (
          <div
            key={musica.id}
            onClick={() => tocarFaixa(filaAlbum, musica.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              setMenuFaixa({ musica, x: e.clientX, y: e.clientY });
            }}
            className="grid grid-cols-[24px_1fr_140px_100px] gap-3 items-center px-2 py-2 rounded-sm hover:bg-white/10 cursor-pointer group text-xs"
          >
            <span className="text-texto-secundario">{index + 1}</span>
            <div className="min-w-0 flex items-center gap-2">
              <p className="font-medium truncate">{musica.title}</p>
              {musica.explicit && (
                <span className="text-[9px] font-bold bg-texto-secundario text-black px-1 leading-tight rounded-xs shrink-0">
                  E
                </span>
              )}
            </div>
            <span className="text-texto-secundario">
              {formatarReproducoes(musica.timesListen)}
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
