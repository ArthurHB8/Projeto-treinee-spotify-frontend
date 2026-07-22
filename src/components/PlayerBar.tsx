import { useState } from "react";
import { Link } from "react-router-dom";

import { resolveImageUrl } from "../api/client";
import { usePlayer } from "../context/PlayerContext";
import audioIcon from "../assets/icons/audioIcon.svg";
import chevronDownIcon from "../assets/icons/chevronDownIcon.svg";
import forwardIcon from "../assets/icons/forwardIcon.svg";
import pauseIcon from "../assets/icons/pauseIcon.svg";
import playIcon from "../assets/icons/playIcon.svg";
import rewindIcon from "../assets/icons/rewindIcon.svg";

const formatarTempo = (segundos: number) => {
  const minutos = Math.floor(segundos / 60);
  const restante = Math.floor(segundos % 60);
  return `${minutos}:${String(restante).padStart(2, "0")}`;
};

export default function PlayerBar() {
  const {
    faixaAtual,
    tocando,
    progresso,
    alternarPlayPause,
    proximaFaixa,
    faixaAnterior,
    irParaProgresso,
    mobileNowPlayingAberto,
    abrirNowPlayingMobile,
    fecharNowPlayingMobile,
  } = usePlayer();
  const [volume, setVolume] = useState(70);

  const capa = resolveImageUrl(faixaAtual?.capa ?? null);
  const duracao = faixaAtual?.musica.duration ?? 0;

  return (
    <>
      {/* Desktop */}
      <div className="hidden h-18 w-full items-center justify-between bg-black px-4 text-white md:flex">
        <div className="flex w-[30%] min-w-0 items-center gap-3">
          {faixaAtual && (
            <>
              {capa ? (
                <img
                  src={capa}
                  alt={faixaAtual.musica.title}
                  className="h-12 w-12 shrink-0 rounded-xs object-cover"
                />
              ) : (
                <div
                  className="h-12 w-12 shrink-0 rounded-xs bg-[#2a2a2a]"
                  aria-hidden="true"
                />
              )}
              <div className="min-w-0">
                <Link
                  to={`/album/${faixaAtual.musica.albumId}`}
                  className="block truncate text-sm font-medium text-inherit no-underline hover:underline"
                >
                  {faixaAtual.musica.title}
                </Link>
                <Link
                  to={`/artist/${faixaAtual.musica.artistId}`}
                  className="text-texto-secundario block truncate text-xs no-underline hover:underline"
                >
                  {faixaAtual.nomeArtista}
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="flex w-[40%] max-w-180.5 flex-col items-center gap-2">
          <div className="flex items-center gap-5">
            <button
              className="cursor-pointer disabled:cursor-default disabled:opacity-40"
              onClick={faixaAnterior}
              disabled={!faixaAtual}
              aria-label="Voltar"
            >
              <img src={rewindIcon} alt="" className="h-4 w-4" />
            </button>
            <button
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white disabled:cursor-default disabled:opacity-40"
              onClick={alternarPlayPause}
              disabled={!faixaAtual}
              aria-label={tocando ? "Pausar" : "Tocar"}
            >
              <img
                src={tocando ? pauseIcon : playIcon}
                alt=""
                className="h-3.5 w-3.5 invert"
              />
            </button>
            <button
              className="cursor-pointer disabled:cursor-default disabled:opacity-40"
              onClick={proximaFaixa}
              disabled={!faixaAtual}
              aria-label="Avançar"
            >
              <img src={forwardIcon} alt="" className="h-4 w-4" />
            </button>
          </div>
          <div className="flex w-full items-center gap-2">
            <span className="text-texto-secundario w-8 text-right text-[11px]">
              {formatarTempo(progresso)}
            </span>
            <input
              type="range"
              min={0}
              max={duracao || 1}
              value={progresso}
              onChange={(e) => irParaProgresso(Number(e.target.value))}
              disabled={!faixaAtual}
              className="h-1 flex-1 cursor-pointer accent-white disabled:cursor-default"
            />
            <span className="text-texto-secundario w-8 text-[11px]">
              {formatarTempo(duracao)}
            </span>
          </div>
        </div>

        <div className="flex w-[30%] items-center justify-end gap-2">
          <img src={audioIcon} alt="" className="h-4 w-4" />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1 w-24 cursor-pointer accent-white"
          />
        </div>
      </div>

      {/* Mobile compact mini player, */}
      {!mobileNowPlayingAberto && faixaAtual && (
        <div
          className="bg-fundo-cards flex h-14 cursor-pointer items-center justify-between gap-3 px-3 text-white md:hidden"
          onClick={abrirNowPlayingMobile}
          role="button"
          aria-label="Abrir player"
        >
          <div className="flex min-w-0 items-center gap-2">
            {capa ? (
              <img
                src={capa}
                alt={faixaAtual.musica.title}
                className="h-10 w-10 shrink-0 rounded-xs object-cover"
              />
            ) : (
              <div
                className="h-10 w-10 shrink-0 rounded-xs bg-[#2a2a2a]"
                aria-hidden="true"
              />
            )}
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">
                {faixaAtual.musica.title}
              </p>
              <p className="text-texto-secundario truncate text-[11px]">
                {faixaAtual.nomeArtista}
              </p>
            </div>
          </div>
          <div
            className="flex shrink-0 items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white"
              onClick={alternarPlayPause}
              aria-label={tocando ? "Pausar" : "Tocar"}
            >
              <img
                src={tocando ? pauseIcon : playIcon}
                alt=""
                className="h-3.5 w-3.5 invert"
              />
            </button>
            <button onClick={proximaFaixa} aria-label="Avançar">
              <img src={forwardIcon} alt="" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile expanded now-playing */}
      {mobileNowPlayingAberto && faixaAtual && (
        <div className="z-50 flex h-32 flex-col justify-between bg-black px-4 py-3 text-white md:hidden">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {faixaAtual.musica.title}
              </p>
              <p className="text-texto-secundario truncate text-xs">
                {faixaAtual.nomeArtista}
              </p>
            </div>
            <div className="flex items-center gap-5">
              <button onClick={faixaAnterior} aria-label="Voltar">
                <img src={rewindIcon} alt="" className="h-4 w-4" />
              </button>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
                onClick={alternarPlayPause}
                aria-label={tocando ? "Pausar" : "Tocar"}
              >
                <img
                  src={tocando ? pauseIcon : playIcon}
                  alt=""
                  className="h-3.5 w-3.5 invert"
                />
              </button>
              <button onClick={proximaFaixa} aria-label="Avançar">
                <img src={forwardIcon} alt="" className="h-4 w-4" />
              </button>
            </div>
            <button
              className="justify-self-end"
              onClick={fecharNowPlayingMobile}
              aria-label="Minimizar"
            >
              <img src={chevronDownIcon} alt="" className="h-4 w-4" />
            </button>
          </div>
          <div className="flex w-full items-center gap-2">
            <span className="text-texto-secundario w-8 text-right text-[11px]">
              {formatarTempo(progresso)}
            </span>
            <input
              type="range"
              min={0}
              max={duracao || 1}
              value={progresso}
              onChange={(e) => irParaProgresso(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer accent-white"
            />
            <span className="text-texto-secundario w-8 text-[11px]">
              {formatarTempo(duracao)}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
