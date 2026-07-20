import { Link } from "react-router-dom";

import spotifyLogo from "../assets/icons/spotifyIcon.svg";
import searchIcon from "../assets/icons/searchIcon.svg";
import downloadIcon from "../assets/icons/downloadIcon.svg";
import notificationIcon from "../assets/icons/notificationIcon.svg";
import homeIcon from "../assets/icons/homeIcon.svg";
import profilePicture from "../assets/profilePicture.jpg";

export default function NavBar() {
  return (
    <div className="text-texto-secundario fixed top-0 z-50 flex h-15 w-full items-center justify-between bg-black p-3">
      <div className="hidden md:block">
        <img src={spotifyLogo} alt="Spotify Logo" />
      </div>

      {/* Search Links */}
      <div className="flex items-center gap-1">
        <Link
          to="/"
          className="bg-fundo-cards flex h-9 w-9 items-center justify-center rounded-full"
        >
          <img src={homeIcon} alt="Home" />
        </Link>
        <div className="bg-fundo-cards hidden h-9 w-[355px] items-center gap-1 rounded-2xl px-2 py-1 md:flex">
          <img src={searchIcon} alt="Search" className="h-2.5 w-2.5" />
          <input
            placeholder="O que voce quer ouvir?"
            className="w-full rounded-sm bg-transparent text-[10px] outline-none placeholder:text-[#B3B3B3]"
          />
        </div>
        <button
          className="bg-fundo-cards flex h-9 w-9 items-center justify-center rounded-full md:hidden"
          aria-label="Buscar"
        >
          <img src={searchIcon} alt="" className="h-3.5 w-3.5" />
        </button>
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
          <div className="bg-fundo-cards flex h-9 w-9 items-center justify-center rounded-full">
            <img
              src={profilePicture}
              alt="Profile"
              className="h-2/3 w-2/3 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
