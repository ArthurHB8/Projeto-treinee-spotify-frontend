import { Link, NavLink, useNavigate } from "react-router-dom";

import spotifyLogo from "../assets/icons/spotifyIcon.svg";
import searchIcon from "../assets/icons/searchIcon.svg";
import downloadIcon from "../assets/icons/downloadIcon.svg";
import notificationIcon from "../assets/icons/notificationIcon.svg";
import homeIcon from "../assets/icons/homeIcon.svg";
import isHomeIcon from "../assets/icons/isHomeIcon.svg";
import profilePicture from "../assets/profilePicture.png";
import { useEffect, useRef, useState } from "react";
import SearchPanel from "./SearchPanel";

export default function NavBar() {
  const [query, setQuery] = useState<string>("");
  const [painelAberto, setPainelAberto] = useState(false);
  const navigate = useNavigate();

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const aoClicarFora = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setPainelAberto(false);
    };
    const aoPressionarTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPainelAberto(false);
    };

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoPressionarTecla);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoPressionarTecla);
    };
  }, [setPainelAberto]);

  return (
    <div className="text-texto-secundario flex h-15 w-full shrink-0 items-center justify-between bg-black p-3">
      <div className="hidden md:block">
        <img src={spotifyLogo} alt="Spotify Logo" />
      </div>

      {/* Search Links */}
      <div className="relative" ref={ref}>
        <div className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            className="bg-fundo-cards flex h-9 w-9 items-center justify-center rounded-full"
          >
            {({ isActive }) => (
              <img src={isActive ? isHomeIcon : homeIcon} alt="Home" />
            )}
          </NavLink>
          <div className="bg-fundo-cards relative hidden h-9 w-88.75 items-center gap-1 rounded-2xl px-2 py-1 md:flex">
            <img src={searchIcon} alt="Search" className="h-2.5 w-2.5" />
            <input
              placeholder="O que voce quer ouvir?"
              className="w-full rounded-sm bg-transparent text-[10px] outline-none placeholder:text-[#B3B3B3]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setPainelAberto(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                  setPainelAberto(false);
                }
              }}
            />
            {painelAberto && (
              <div className="absolute top-full left-0 z-60 w-full">
                <SearchPanel
                  query={query}
                  onFechar={() => setPainelAberto(false)}
                />
              </div>
            )}
          </div>
          <Link
            to="/search"
            className="bg-fundo-cards flex h-9 w-9 items-center justify-center rounded-full md:hidden"
            aria-label="Buscar"
          >
            <img src={searchIcon} alt="" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-1.5 text-[10px] md:flex">
          <img src={downloadIcon} alt="Download" className="h-3 w-3" />
          Instalar app
        </div>
        <div className="flex items-center gap-3">
          <img
            src={notificationIcon}
            alt="Notification"
            className="hidden h-3 w-3 md:block"
          />
          <Link
            to="/profile"
            className="bg-fundo-cards flex h-9 w-9 items-center justify-center rounded-full"
          >
            <img
              src={profilePicture}
              alt="Profile"
              className="h-2/3 w-2/3 rounded-full"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
