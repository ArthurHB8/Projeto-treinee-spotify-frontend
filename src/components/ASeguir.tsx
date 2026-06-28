import imageNext from "../assets/image-next.png";

export default function ASeguir() {
  return (
    <div className="bg-fundo-cards rounded-lg mt-6 p-3 overflow-hidden">
      <h2 className="text-xs font-bold mb-3">A Seguir</h2>

      <div className="flex gap-3 items-center">
        <div className="w-10.5 h-10.5">
          <img
            src={imageNext}
            alt="Next song"
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div>
          <h3 className="text-[11px] font-semibold">Crew Love</h3>
          <p className="text-[10px] text text-texto-secundario">
            Drake, The Weeknd
          </p>
        </div>
      </div>
    </div>
  );
}
