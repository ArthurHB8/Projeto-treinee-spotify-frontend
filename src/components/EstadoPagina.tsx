import type { ReactNode } from "react";

type EstadoPaginaProps = {
  children: ReactNode;
};

export default function EstadoPagina({ children }: EstadoPaginaProps) {
  return (
    <div className="flex max-h-[calc(100vh-63px)] min-w-0 flex-1 items-center justify-center overflow-y-auto rounded-lg bg-[#121212] pb-[88px] text-white">
      {children}
    </div>
  );
}
