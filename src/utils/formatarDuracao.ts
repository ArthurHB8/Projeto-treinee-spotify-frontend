export function formatarDuracao(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const restante = segundos % 60;
  return `${minutos}:${String(restante).padStart(2, "0")}`;
}

export function formatarDuracaoTotal(segundos: number): string {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  return horas > 0
    ? `${horas}h${String(minutos).padStart(2, "0")}min`
    : `${minutos} min`;
}
