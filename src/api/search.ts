import { api } from "./client";
import type { SearchResults } from "./types";

export const search = (query: string, limit?: number) => {
  const params = new URLSearchParams();

  params.append("q", query);

  if (limit !== undefined) {
    params.append("limit", String(limit));
  }

  return api.get<SearchResults>(`/search?${params.toString()}`);
};
