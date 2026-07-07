import type { BibliotecaItem } from "../types";

export function ordenarItensBiblioteca(
  itens: BibliotecaItem[],
): BibliotecaItem[] {
  const unpinnedItens = itens.filter((item) => item.pinnedAt === null);

  const pinnedItens = itens.filter(
    (item): item is BibliotecaItem & { pinnedAt: string } => item.pinnedAt !== null,
  );

  pinnedItens.sort(
    (a, b) => new Date(a.pinnedAt).getTime() - new Date(b.pinnedAt).getTime(),
  );

  unpinnedItens.sort(
    (a, b) =>
      new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime(),
  );

  const finalItens: BibliotecaItem[] = [...pinnedItens, ...unpinnedItens];

  return finalItens;
}
