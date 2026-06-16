export default function Turne() {
  return (
    <div className="text-white bg-fundo-cards rounded-lg mt-6 p-3">
      <h2 className="text-xs font-bold">Em turnê</h2>
      <div className="flex gap-3 mt-3 items-center">
        {/* w-42px e h-42px */}
        <div className="flex flex-col items-center justify-center rounded w-10.5 h-10.5 bg-[#121212]">
          <p className="text-[8px] font-bold">Mai</p>
          <p className="text-base font-bold">24</p>
        </div>
        <div className="flex flex-col">
          <h3 className="text-[11px] font-semibold">Los angeles</h3>
          <p className="text-[10px] text-texto-secundario">
            LNGSHOT, P1Harmony e Jay Park
          </p>
          <p className="text-[10px] text-texto-secundario">
            dom., 18:00 • Peacock Theather
          </p>
        </div>
      </div>
    </div>
  );
}
