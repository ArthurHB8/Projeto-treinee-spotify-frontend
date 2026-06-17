export default function Turne() {
  const eventosMock = [
    {
      id: 1,
      mes: "Mai.",
      dia: "24",
      cidade: "Los Angeles",
      artistas: "LNGSHOT, P1Harmony e Jay Park",
      detalhes: "dom., 18:00 • Peacock Theather",
      url: "https://ingressos.com/1",
    },
    {
      id: 2,
      mes: "Jun.",
      dia: "10",
      cidade: "Nova York",
      artistas: "LNGSHOT, TXT",
      detalhes: "sex., 20:00 • Madison Square Garden",
      url: "https://ingressos.com/2",
    },
    {
      id: 3,
      mes: "Jul.",
      dia: "05",
      cidade: "Chicago",
      artistas: "LNGSHOT Solo",
      detalhes: "sáb., 19:00 • United Center",
      url: "https://ingressos.com/3",
    },
    {
      id: 4,
      mes: "Ago.",
      dia: "12",
      cidade: "Miami",
      artistas: "LNGSHOT, ATEEZ",
      detalhes: "qui., 21:00 • Kaseya Center",
      url: "https://ingressos.com/4",
    },
  ];

  if (eventosMock.length === 0) {
    return null; // Não renderiza nada se não houver eventos
  }

  return (
    <div className="text-white bg-fundo-cards rounded-lg mt-6 p-3">
      <h2 className="text-xs font-bold">Em turnê</h2>
      {eventosMock.slice(0, 3).map((evento) => (
        <a
          key={evento.id}
          href={evento.url}
          className="flex gap-3 items-center hover:bg-[#3E3E3E] p-2 rounded transition-colors"
        >
          <div className="flex gap-3 items-center">
            {/* w-42px e h-42px */}
            <div className="flex flex-col items-center justify-center rounded w-10.5 h-10.5 bg-[#121212]">
              <p className="text-[8px] font-bold">{evento.mes}</p>
              <p className="text-base font-bold">{evento.dia}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-[11px] font-semibold">{evento.cidade}</h3>
              <p className="text-[10px] text-texto-secundario">
                {evento.artistas}
              </p>
              <p className="text-[10px] text-texto-secundario">
                {evento.detalhes}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
