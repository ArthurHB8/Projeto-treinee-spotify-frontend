import type { RecentSearchItem } from "../types";

const SPOTIFY_RECENT_SEARCHES = "spotifyRecentSearches";

export function getRecentSearches(): RecentSearchItem[] {
  let recentSearch = localStorage.getItem(SPOTIFY_RECENT_SEARCHES);

  try {
    if (recentSearch === null) return [];

    recentSearch = JSON.parse(recentSearch);

    if (Array.isArray(recentSearch)) {
      return recentSearch;
    }

    return [];
  } catch {
    return [];
  }
}

export function addRecentSearch(item: RecentSearchItem): void {
  const recentList = getRecentSearches();

  const recentNoQuery = recentList.filter((recent) => recent.id !== item.id);
  const newRecent = [item, ...recentNoQuery].slice(0, 5);

  localStorage.setItem(SPOTIFY_RECENT_SEARCHES, JSON.stringify(newRecent));
}

export function clearRecentSearches(): void {
  localStorage.removeItem(SPOTIFY_RECENT_SEARCHES);
}

export function removeRecentSearch(id: string): void {
  const recentList = getRecentSearches();
  const recentRemoved = recentList.filter((item) => item.id !== id);

  localStorage.setItem(SPOTIFY_RECENT_SEARCHES, JSON.stringify(recentRemoved));
}
