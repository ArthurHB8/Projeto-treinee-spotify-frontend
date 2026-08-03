import type { ReactNode } from "react";

type ConfirmarExclusaoModalProps = {
  titulo: string;
  mensagem: ReactNode;
  aoCancelar: () => void;
  aoConfirmar: () => void;
};

export default function ConfirmarExclusaoModal({
  titulo,
  mensagem,
  aoCancelar,
  aoConfirmar,
}: ConfirmarExclusaoModalProps) {
  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => {
        e.stopPropagation();
        aoCancelar();
      }}
    >
      <div
        className="flex w-full max-w-108 flex-col justify-between gap-6 rounded-md bg-white p-6 text-black md:h-43.25"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 className="text-lg font-bold">{titulo}</h2>
          <p className="mt-2 text-sm text-[#121212]">{mensagem}</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="cursor-pointer px-4 py-2 text-sm font-bold text-black hover:underline"
            onClick={aoCancelar}
          >
            Cancelar
          </button>
          <button
            className="cursor-pointer rounded-full bg-[#D03930] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
            onClick={aoConfirmar}
          >
            Apagar
          </button>
        </div>
      </div>
    </div>
  );
}
