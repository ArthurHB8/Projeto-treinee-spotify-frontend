import { useState } from "react";

import { resolveImageUrl } from "../api/client";
import { usePlayer } from "../context/PlayerContext";
import audioIcon from "../assets/icons/audioIcon.svg";
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
  } = usePlayer();
  const [volume, setVolume] = useState(70);

  const capa = resolveImageUrl(faixaAtual?.capa ?? null);
  const duracao = faixaAtual?.musica.duration ?? 0;

  return (
    <div className="fixed bottom-0 left-0 w-full h-[72px] bg-black flex items-center justify-between px-4 z-50 text-white">
      <div className="flex items-center gap-3 w-[30%] min-w-0">
        {faixaAtual && (
          <>
            {capa ? (
              <img
                src={capa}
                alt={faixaAtual.musica.title}
                className="w-12 h-12 object-cover shrink-0 rounded-xs"
              />
            ) : (
              <div
                className="w-12 h-12 bg-[#2a2a2a] shrink-0 rounded-xs"
                aria-hidden="true"
              />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {faixaAtual.musica.title}
              </p>
              <p className="text-xs text-texto-secundario truncate">
                {faixaAtual.nomeArtista}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 w-[40%] max-w-[722px]">
        <div className="flex items-center gap-5">
          <button
            className="cursor-pointer disabled:opacity-40 disabled:cursor-default"
            onClick={faixaAnterior}
            disabled={!faixaAtual}
            aria-label="Voltar"
          >
            <img src={rewindIcon} alt="" className="w-4 h-4" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-default"
            onClick={alternarPlayPause}
            disabled={!faixaAtual}
            aria-label={tocando ? "Pausar" : "Tocar"}
          >
            <img
              src={tocando ? pauseIcon : playIcon}
              alt=""
              className="w-3.5 h-3.5 invert"
            />
          </button>
          <button
            className="cursor-pointer disabled:opacity-40 disabled:cursor-default"
            onClick={proximaFaixa}
            disabled={!faixaAtual}
            aria-label="Avançar"
          >
            <img src={forwardIcon} alt="" className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-[11px] text-texto-secundario w-8 text-right">
            {formatarTempo(progresso)}
          </span>
          <input
            type="range"
            min={0}
            max={duracao || 1}
            value={progresso}
            onChange={(e) => irParaProgresso(Number(e.target.value))}
            disabled={!faixaAtual}
            className="flex-1 h-1 accent-white cursor-pointer disabled:cursor-default"
          />
          <span className="text-[11px] text-texto-secundario w-8">
            {formatarTempo(duracao)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-[30%] justify-end">
        <img src={audioIcon} alt="" className="w-4 h-4" />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 h-1 accent-white cursor-pointer"
        />
      </div>
    </div>
  );
}
