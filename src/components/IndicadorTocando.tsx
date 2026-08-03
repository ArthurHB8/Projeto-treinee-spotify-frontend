import { useEffect, useState } from "react";

import quadro1 from "../assets/icons/playingNow1.svg";
import quadro2 from "../assets/icons/playingNow2.svg";

export default function IndicadorTocando() {
  const [quadro, setQuadro] = useState(quadro1);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setQuadro((atual) => (atual === quadro1 ? quadro2 : quadro1));
    }, 400);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <img src={quadro} alt="Tocando agora" className="h-2.5 w-2.75 shrink-0" />
  );
}
