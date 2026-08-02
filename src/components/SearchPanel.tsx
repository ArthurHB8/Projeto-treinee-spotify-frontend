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
import SearchResultRow from "./SearchResultRow";

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
          {recentSearches.map((item) => (
            <SearchResultRow
              key={item.id}
              imageUrl={resolveImageUrl(item.imageUrl)}
              title={item.label}
              subtitle={item.subtitle}
              rounded={item.type === "artist"}
              showPlayIcon={item.type === "music"}
              onClick={() => aoClicarRecente(item)}
              onRemove={() => removerRecente(item.id)}
            />
          ))}
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
              {!!searchResults?.artists.length && (
                <p className="px-2 py-1 text-[12px] font-bold">Artistas</p>
              )}
              {searchResults?.artists.map((artista) => (
                <SearchResultRow
                  key={artista.id}
                  imageUrl={resolveImageUrl(artista.imageUrl)}
                  title={artista.name}
                  subtitle="Artista"
                  rounded
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
                />
              ))}
              {!!searchResults?.albums.length && (
                <p className="px-2 py-1 text-[12px] font-bold">Álbuns</p>
              )}
              {searchResults?.albums.map((album) => (
                <SearchResultRow
                  key={album.id}
                  imageUrl={resolveImageUrl(album.imageUrl)}
                  title={album.title}
                  subtitle={`Álbum • ${album.artistName}`}
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
                />
              ))}
              {!!searchResults?.playlists.length && (
                <p className="px-2 py-1 text-[12px] font-bold">Playlists</p>
              )}
              {searchResults?.playlists.map((playlist) => (
                <SearchResultRow
                  key={playlist.id}
                  imageUrl={resolveImageUrl(playlist.imageUrl)}
                  title={playlist.name}
                  subtitle="Playlist"
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
                />
              ))}
              {!!searchResults?.musics.length && (
                <p className="px-2 py-1 text-[12px] font-bold">Músicas</p>
              )}
              {searchResults?.musics.map((musica) => (
                <SearchResultRow
                  key={musica.id}
                  imageUrl={resolveImageUrl(musica.albumImageUrl)}
                  title={musica.title}
                  subtitle={`Música • ${musica.artistName}`}
                  showPlayIcon
                  onClick={() => {
                    const faixaFila: FaixaFila = {
                      musica,
                      capa: musica.albumImageUrl,
                      nomeArtista: musica.artistName,
                    };
                    tocarFaixa([faixaFila], musica.id);
                    registrarRecente({
                      id: musica.id,
                      type: "music",
                      label: musica.title,
                      subtitle: `Música • ${musica.artistName}`,
                      imageUrl: musica.albumImageUrl,
                      albumId: musica.albumId,
                    });
                    onFechar();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
