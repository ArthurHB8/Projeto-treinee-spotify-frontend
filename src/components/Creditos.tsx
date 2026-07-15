export default function Creditos() {
  return (
    <div className="bg-fundo-cards mt-6 rounded-lg p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold">Creditos</h2>
        <button className="text-texto-secundario text-[10px]">
          Mostrar tudo
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs">LNGSHOT</h3>
          <p className="text-texto-secundario text-[10px]">Artista principal</p>
        </div>
        <button className="cursor-pointer rounded-2xl border border-[#7c7c7c] px-3 py-1.5 text-[10px]">
          Deixar de seguir
        </button>
      </div>

      <div className="mb-3">
        <h3 className="text-xs">WOOJIN of LINGSHOT</h3>
        <p className="text-texto-secundario text-[10px]">
          Arranjos • Autores • Letrista
        </p>
      </div>

      <div>
        <h3 className="text-xs">LOUIS of LINGSHOT</h3>
        <p className="text-texto-secundario text-[10px]">
          Arranjos • Autores • Letrista
        </p>
      </div>
    </div>
  );
}
