import { Link } from "react-router-dom";

import spotifyLogo from "../assets/icons/spotifyIcon.svg";
import searchIcon from "../assets/icons/searchIcon.svg";
import downloadIcon from "../assets/icons/downloadIcon.svg";
import notificationIcon from "../assets/icons/notificationIcon.svg";
import homeIcon from "../assets/icons/homeIcon.svg";
import profilePicture from "../assets/profilePicture.jpg";

export default function NavBar() {
  return (
    <div className="bg-black flex justify-between items-center text-texto-secundario p-3 fixed top-0 h-15 w-full z-50 ">
      <div>
        <img src={spotifyLogo} alt="Spotify Logo" />
      </div>

      {/* Search Links */}
      <div className="flex items-center gap-1">
        <Link
          to="/"
          className="rounded-full bg-fundo-cards w-9 h-9 flex items-center justify-center"
        >
          <img src={homeIcon} alt="Home" />
        </Link>
        <div className="flex bg-fundo-cards rounded-2xl px-2 py-1 h-9 gap-1 items-center w-[355px]">
          <img src={searchIcon} alt="Search" className="w-2.5 h-2.5" />
          <input
            placeholder="O que voce quer ouvir?"
            className="text-[10px] placeholder:text-[#B3B3B3] rounded-sm w-full outline-none bg-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[10px]">
          <img src={downloadIcon} alt="Download" className="w-3 h-3" />
          Instalar app
        </div>
        <div className="flex items-center gap-3">
          <img src={notificationIcon} alt="Notification" className="w-3 h-3" />
          <div className="rounded-full bg-fundo-cards w-9 h-9 flex items-center justify-center">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-2/3 h-2/3 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
