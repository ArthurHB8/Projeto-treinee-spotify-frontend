import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useDebounce } from "../hooks/useDebounce";
import { search } from "../api/search";
import { getAlbumById } from "../api/album";
import { resolveImageUrl } from "../api/client";
import { usePlayer } from "../context/PlayerContext";
import {
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
} from "../utils/recentSearches";

import EstadoPagina from "../components/EstadoPagina";
import SearchResultRow from "../components/SearchResultRow";
import { CardAlbum, CardArtista, CardPlaylist } from "../components/Cards";
import searchIcon from "../assets/icons/searchIcon.svg";

import type { Album, Music, SearchResults } from "../api/types";
import type { BotaoFiltroProps, FaixaFila, RecentSearchItem } from "../types";

const RESULT_LIMIT = 50;

type FiltroBusca = "Tudo" | "Música" | "Artista" | "Álbum" | "Playlist";

const BotaoFiltro = ({ texto, ativo, onClick }: BotaoFiltroProps) => (
  <button
    className={`cursor-pointer rounded-full px-[15.5px] py-2.5 text-[10px] transition-colors ${
      ativo
        ? "bg-white text-black"
        : "bg-[#343333] text-white hover:bg-[#4a4a4a]"
    }`}
    onClick={onClick}
  >
    {texto}
  </button>
);

export default function SearchPage() {
  const { tocarFaixa } = usePlayer();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";

  const [mobileQuery, setMobileQuery] = useState(urlQuery);
  const debouncedMobileQuery = useDebounce(mobileQuery, 400);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null,
  );
  const [recentSearches, setRecentSearches] =
    useState<RecentSearchItem[]>(getRecentSearches);
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroBusca>("Tudo");

  useEffect(() => {
    if (debouncedMobileQuery === urlQuery) return;
    setSearchParams(debouncedMobileQuery ? { q: debouncedMobileQuery } : {}, {
      replace: true,
    });
  }, [debouncedMobileQuery, urlQuery, setSearchParams]);

  useEffect(() => {
    if (!urlQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setCarregando(true);
    setErro(null);

    search(urlQuery, RESULT_LIMIT)
      .then(setSearchResults)
      .catch(() => setErro("Não foi possível carregar a busca."))
      .finally(() => setCarregando(false));
  }, [urlQuery]);

  const registrarRecente = (item: RecentSearchItem) => {
    addRecentSearch(item);
    setRecentSearches(getRecentSearches());
  };

  const limparRecentes = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const aoClicarRecente = (item: RecentSearchItem) => {
    if (item.type === "music") {
      tocarRecenteMusica(item);
      return;
    }
    registrarRecente(item);
    navigate(`/${item.type}/${item.id}`);
  };

  const tocarRecenteMusica = async (item: RecentSearchItem) => {
    if (!item.albumId) return;
    const album = await getAlbumById(item.albumId);
    const musica = album.musics.find((m) => m.id === item.id);
    if (!musica) return;
    tocarFaixaComAlbum(musica, album);
    registrarRecente(item);
  };

  const tocarFaixaComAlbum = (musica: Music, album: Album) => {
    const faixaFila: FaixaFila = {
      musica,
      capa: album.imageUrl,
      nomeArtista: album.artistName,
    };
    tocarFaixa([faixaFila], musica.id);
  };

  const tocarMusica = (musica: Music) => {
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
  };

  const query = urlQuery.trim();
  const mostrarMusicas =
    (filtroAtivo === "Tudo" || filtroAtivo === "Música") &&
    !!searchResults?.musics.length;
  const mostrarArtistas =
    (filtroAtivo === "Tudo" || filtroAtivo === "Artista") &&
    !!searchResults?.artists.length;
  const mostrarAlbuns =
    (filtroAtivo === "Tudo" || filtroAtivo === "Álbum") &&
    !!searchResults?.albums.length;
  const mostrarPlaylists =
    (filtroAtivo === "Tudo" || filtroAtivo === "Playlist") &&
    !!searchResults?.playlists.length;
  const semResultados =
    !!searchResults &&
    !mostrarMusicas &&
    !mostrarArtistas &&
    !mostrarAlbuns &&
    !mostrarPlaylists;

  return (
    <div className="max-h-[calc(100vh-63px)] min-w-0 flex-1 overflow-y-auto rounded-lg bg-[#121212] p-3 pb-[88px] text-white">
      <div className="bg-fundo-cards relative mb-4 flex h-9 items-center gap-1 rounded-2xl px-2 py-1 md:hidden">
        <img src={searchIcon} alt="Search" className="h-2.5 w-2.5" />
        <input
          autoFocus
          placeholder="O que voce quer ouvir?"
          className="w-full rounded-sm bg-transparent text-[10px] outline-none placeholder:text-[#B3B3B3]"
          value={mobileQuery}
          onChange={(e) => setMobileQuery(e.target.value)}
        />
      </div>

      {!query && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-base font-bold">Buscas Recentes</p>
            {recentSearches.length > 0 && (
              <button
                onClick={limparRecentes}
                className="cursor-pointer text-[10px] text-[#B3B3B3] hover:text-white"
              >
                Limpar tudo
              </button>
            )}
          </div>
          {recentSearches.map((item) => (
            <SearchResultRow
              key={item.id}
              imageUrl={resolveImageUrl(item.imageUrl)}
              title={item.label}
              subtitle={item.subtitle}
              rounded={item.type === "artist"}
              showPlayIcon={item.type === "music"}
              onClick={() => aoClicarRecente(item)}
            />
          ))}
        </div>
      )}

      {query && carregando && <EstadoPagina>Buscando...</EstadoPagina>}
      {query && !carregando && erro && (
        <EstadoPagina>
          <p className="text-red-400">{erro}</p>
        </EstadoPagina>
      )}

      {query && !carregando && !erro && searchResults && (
        <div>
          <div className="mb-4 flex gap-2">
            <BotaoFiltro
              texto="Tudo"
              ativo={filtroAtivo === "Tudo"}
              onClick={() => setFiltroAtivo("Tudo")}
            />
            <BotaoFiltro
              texto="Músicas"
              ativo={filtroAtivo === "Música"}
              onClick={() => setFiltroAtivo("Música")}
            />
            <BotaoFiltro
              texto="Artistas"
              ativo={filtroAtivo === "Artista"}
              onClick={() => setFiltroAtivo("Artista")}
            />
            <BotaoFiltro
              texto="Álbuns"
              ativo={filtroAtivo === "Álbum"}
              onClick={() => setFiltroAtivo("Álbum")}
            />
            <BotaoFiltro
              texto="Playlists"
              ativo={filtroAtivo === "Playlist"}
              onClick={() => setFiltroAtivo("Playlist")}
            />
          </div>

          {mostrarMusicas && (
            <section className="mb-6">
              <h2 className="mb-3 text-base font-bold">Músicas</h2>
              <div>
                {searchResults.musics.map((musica) => (
                  <SearchResultRow
                    key={musica.id}
                    imageUrl={resolveImageUrl(musica.albumImageUrl)}
                    title={musica.title}
                    subtitle={`Música • ${musica.artistName}`}
                    showPlayIcon
                    onClick={() => tocarMusica(musica)}
                  />
                ))}
              </div>
            </section>
          )}

          {mostrarArtistas && (
            <section className="mb-6">
              <h2 className="mb-3 text-base font-bold">Artistas</h2>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {searchResults.artists.map((artista) => (
                  <CardArtista
                    key={artista.id}
                    id={artista.id}
                    capa={resolveImageUrl(artista.imageUrl)}
                    nome={artista.name}
                    onClick={() =>
                      registrarRecente({
                        id: artista.id,
                        type: "artist",
                        label: artista.name,
                        subtitle: "Artista",
                        imageUrl: artista.imageUrl,
                      })
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {mostrarAlbuns && (
            <section className="mb-6">
              <h2 className="mb-3 text-base font-bold">Álbuns</h2>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {searchResults.albums.map((album) => (
                  <CardAlbum
                    key={album.id}
                    id={album.id}
                    capa={resolveImageUrl(album.imageUrl)}
                    titulo={album.title}
                    artista={album.artistName}
                    onClick={() =>
                      registrarRecente({
                        id: album.id,
                        type: "album",
                        label: album.title,
                        subtitle: `Álbum • ${album.artistName}`,
                        imageUrl: album.imageUrl,
                      })
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {mostrarPlaylists && (
            <section className="mb-6">
              <h2 className="mb-3 text-base font-bold">Playlists</h2>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {searchResults.playlists.map((playlist) => (
                  <CardPlaylist
                    key={playlist.id}
                    id={playlist.id}
                    capa={resolveImageUrl(playlist.imageUrl)}
                    titulo={playlist.name}
                    artista="Vitoria Tenorio"
                    onClick={() =>
                      registrarRecente({
                        id: playlist.id,
                        type: "playlist",
                        label: playlist.name,
                        subtitle: "Playlist",
                        imageUrl: playlist.imageUrl,
                      })
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {semResultados && (
            <p className="text-texto-secundario">
              Nenhum resultado encontrado para "{query}".
            </p>
          )}
        </div>
      )}
    </div>
  );
}
