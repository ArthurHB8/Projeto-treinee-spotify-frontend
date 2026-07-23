export function formatarNumero(n: number): string {
  return new Intl.NumberFormat("pt-BR").format(n);
}
