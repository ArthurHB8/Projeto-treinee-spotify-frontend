import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { SearchResults } from "../api/types";
import { search } from "../api/search";
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
} from "../utils/recentSearches";
import { useNavigate } from "react-router-dom";
import { getAlbumById } from "../api/album";
import { resolveImageUrl } from "../api/client";
import { usePlayer } from "../context/PlayerContext";
import type { FaixaFila, RecentSearchItem } from "../types";
import playIcon from "../assets/icons/playIcon.svg";
import removeIcon from "../assets/icons/deleteRecent.svg";

type SearchProps = {
  query: string;
  onFechar: () => void;
};

export default function SearchPanel({ query, onFechar }: SearchProps) {
  const { tocarFaixa } = usePlayer();
  const debouncedQuery = useDebounce(query, 400);
  const [carregando, setCarregando] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null,
  );
  const [erro, setErro] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] =
    useState<RecentSearchItem[]>(getRecentSearches);
  const navigate = useNavigate();

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      return;
    }

    setCarregando(true);
    setErro(null);

    search(debouncedQuery)
      .then(setSearchResults)
      .catch(() => setErro("Não foi possível carregar a busca."))
      .finally(() => setCarregando(false));
  }, [debouncedQuery]);

  const registrarRecente = (item: RecentSearchItem) => {
    addRecentSearch(item);
    setRecentSearches(getRecentSearches());
  };

  const removerRecente = (id: string) => {
    removeRecentSearch(id);
    setRecentSearches(getRecentSearches());
  };

  const tocarRecenteMusica = async (item: RecentSearchItem) => {
    if (!item.albumId) return;

    const album = await getAlbumById(item.albumId);
    const musica = album.musics.find((m) => m.id === item.id);
    if (!musica) return;

    const faixaFila: FaixaFila = {
      musica,
      capa: album.imageUrl,
      nomeArtista: album.artistName,
    };
    tocarFaixa([faixaFila], musica.id);
    registrarRecente(item);
    onFechar();
  };

  const aoClicarRecente = (item: RecentSearchItem) => {
    if (item.type === "music") {
      tocarRecenteMusica(item);
      return;
    }

    registrarRecente(item);
    navigate(`/${item.type}/${item.id}`);
    onFechar();
  };

  return (
    <div className="max-h-100 w-full overflow-y-auto rounded-md bg-[#282828] p-2 text-white shadow-xl">
      {!debouncedQuery.trim() && (
        <div>
          <p className="px-2 py-1 text-[12px] font-bold">Buscas Recentes</p>
          {recentSearches.map((item) => {
            const capa = resolveImageUrl(item.imageUrl);
            const arredondado =
              item.type === "artist" ? "rounded-full" : "rounded-sm";

            return (
              <div
                key={item.id}
                className="group flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-white/10"
              >
                <button
                  onClick={() => aoClicarRecente(item)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <div className="relative h-10 w-10 shrink-0">
                    {capa ? (
                      <img
                        src={capa}
                        alt={item.label}
                        className={`h-10 w-10 object-cover ${arredondado}`}
                      />
                    ) : (
                      <div
                        className={`h-10 w-10 bg-[#2a2a2a] ${arredondado}`}
                        aria-hidden="true"
                      />
                    )}
                    {item.type === "music" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <img src={playIcon} alt="" className="h-3 w-3 invert" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {item.label}
                    </p>
                    <p className="text-texto-secundario truncate text-xs">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => removerRecente(item.id)}
                  aria-label="Remover da busca recente"
                  className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <img src={removeIcon} alt="" className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {debouncedQuery.trim() && (
        <div>
          {carregando ? (
            <p>Buscando...</p>
          ) : erro ? (
            <p>{erro}</p>
          ) : (
            <div>
              {searchResults?.artists.map((artista) => (
                <button
                  key={artista.id}
                  onClick={() => {
                    registrarRecente({
                      id: artista.id,
                      type: "artist",
                      label: artista.name,
                      subtitle: "Artista",
                      imageUrl: artista.imageUrl,
                    });
                    navigate(`/artist/${artista.id}`);
                    onFechar();
                  }}
                >
                  {artista.name}
                </button>
              ))}
              {searchResults?.albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => {
                    registrarRecente({
                      id: album.id,
                      type: "album",
                      label: album.title,
                      subtitle: `Álbum • ${album.artistName}`,
                      imageUrl: album.imageUrl,
                    });
                    navigate(`/album/${album.id}`);
                    onFechar();
                  }}
                >
                  {album.title}
                </button>
              ))}
              {searchResults?.playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => {
                    registrarRecente({
                      id: playlist.id,
                      type: "playlist",
                      label: playlist.name,
                      subtitle: "Playlist",
                      imageUrl: playlist.imageUrl,
                    });
                    navigate(`/playlist/${playlist.id}`);
                    onFechar();
                  }}
                >
                  {playlist.name}
                </button>
              ))}
              {searchResults?.musics.map((musica) => (
                <button
                  key={musica.id}
                  onClick={async () => {
                    const album = await getAlbumById(musica.albumId);
                    const faixaFila: FaixaFila = {
                      musica: musica,
                      capa: album.imageUrl,
                      nomeArtista: album.artistName,
                    };
                    tocarFaixa([faixaFila], musica.id);
                    registrarRecente({
                      id: musica.id,
                      type: "music",
                      label: musica.title,
                      subtitle: `Música • ${album.artistName}`,
                      imageUrl: album.imageUrl,
                      albumId: musica.albumId,
                    });
                    onFechar();
                  }}
                >
                  {musica.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
