import { usePlayer } from "../context/PlayerContext";
import { resolveImageUrl } from "../api/client";

export default function TocandoAgoraMobile() {
  const { faixaAtual, mobileNowPlayingAberto } = usePlayer();

  if (!mobileNowPlayingAberto || !faixaAtual) return null;

  const capa = resolveImageUrl(faixaAtual.capa);

  return (
    <div className="fixed inset-x-0 top-15 bottom-32 z-40 flex items-center justify-center bg-gradient-to-b from-[#5f5f5f] to-[#121212] p-8 md:hidden">
      {capa ? (
        <img
          src={capa}
          alt={faixaAtual.musica.title}
          className="aspect-square w-full max-w-[320px] rounded-lg object-cover shadow-2xl"
        />
      ) : (
        <div
          className="aspect-square w-full max-w-[320px] rounded-lg bg-[#2a2a2a] shadow-2xl"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
