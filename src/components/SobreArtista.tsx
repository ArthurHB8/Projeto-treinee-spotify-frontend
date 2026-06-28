import artistImg from "../assets/artist-image.png";

export default function SobreArtista() {
  return (
    <div className="bg-fundo-cards rounded-lg mt-6">
      <div className="relative">
        <p className="text-xs font-bold absolute top-0 left-0 p-3">
          Sobre o artista
        </p>
        <img
          src={artistImg}
          alt="LNGSHOT"
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>

      <div>
        <h2 className="text-xs p-3">LNGSHOT</h2>
        <div className="flex items-center justify-between px-3">
          <p className="text-[11px] text-texto-secundario">
            4.965.405 ouvintes mensais
          </p>
          <button className="px-3 py-1.5 text-[10px] border border-[#7c7c7c] rounded-2xl cursor-pointer">
            Deixar de seguir
          </button>
        </div>
        <p className="text-[10px] text-texto-secundario p-3">
          LNGSHOT is the first boy group introduced by Jay Park, a defining
          figure in hiphop, R&B, and Korean pop culture, and the executive
          producer shaping MORE...
        </p>
      </div>
    </div>
  );
}
