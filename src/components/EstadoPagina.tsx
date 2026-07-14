import type { ReactNode } from "react";

type EstadoPaginaProps = {
  children: ReactNode;
};

export default function EstadoPagina({ children }: EstadoPaginaProps) {
  return (
    <div className="text-white bg-[#121212] rounded-lg flex-1 min-w-0 max-h-195 overflow-y-auto pb-[88px] flex items-center justify-center">
      {children}
    </div>
  );
}
