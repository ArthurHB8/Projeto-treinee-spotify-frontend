export default function Creditos() {
  return (
    <div className="bg-fundo-cards rounded-lg p-3 mt-6">
      <div className=" mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold">Creditos</h2>
        <button className="text-[10px] text-texto-secundario">
          Mostrar tudo
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs">LNGSHOT</h3>
          <p className="text-[10px] text-texto-secundario">Artista principal</p>
        </div>
        <button className="text-[10px] py-1.5 px-3 border border-[#7c7c7c] rounded-2xl cursor-pointer">
          Deixar de seguir
        </button>
      </div>

      <div className="mb-3">
        <h3 className="text-xs">WOOJIN of LINGSHOT</h3>
        <p className="text-[10px] text-texto-secundario">
          Arranjos • Autores • Letrista
        </p>
      </div>

      <div>
        <h3 className="text-xs">LOUIS of LINGSHOT</h3>
        <p className="text-[10px] text-texto-secundario">
          Arranjos • Autores • Letrista
        </p>
      </div>
    </div>
  );
}
