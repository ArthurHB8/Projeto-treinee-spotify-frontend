import imageNext from "../assets/image-next.png";

export default function ASeguir() {
  return (
    <div className="bg-fundo-cards mt-6 overflow-hidden rounded-lg p-3">
      <h2 className="mb-3 text-xs font-bold">A Seguir</h2>

      <div className="flex items-center gap-3">
        <div className="h-10.5 w-10.5">
          <img
            src={imageNext}
            alt="Next song"
            className="h-full w-full rounded object-cover"
          />
        </div>
        <div>
          <h3 className="text-[11px] font-semibold">Crew Love</h3>
          <p className="text text-texto-secundario text-[10px]">
            Drake, The Weeknd
          </p>
        </div>
      </div>
    </div>
  );
}
