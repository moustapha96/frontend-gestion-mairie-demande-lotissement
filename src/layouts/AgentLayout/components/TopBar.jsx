import logo from "@/assets/logo_200X200.png";

import { LuLogOut, LuMail, LuSearch, LuUser2 } from "react-icons/lu";
import { Link } from "react-router-dom";
import AgentMenu from "./AgentMenu";
import MaximizeScreen from "./MaximizeScreen";
import ProfileDropdown from "./ProfileDropdown";
import { useAuthContext } from "@/context";

const TopBar = () => {
  const { logout } = useAuthContext();
  return (
    <header className="sticky top-0 z-50">
      <div className="z-50 flex w-full flex-wrap border-b border-default-200 bg-zinc-950 py-2.5 text-sm sm:flex-nowrap sm:justify-start sm:py-4">
        <nav className="container flex w-full items-center justify-between gap-6">
          <div>
            <Link to="/agent/dashboard" className="block">
              <img src={logo} className="flex h-16" alt="Logo gestion de la mairie" />
            </Link>
            {/* <span className=" text-bold text-2xl" >
              <span className="text-brown" >Gestion de la </span>  <span className="text-primary" >Mairie</span>
            </span> */}
          </div>
          <div className="flex items-center gap-3">


            <div className="hidden sm:flex">
              <MaximizeScreen />
            </div>


            <Link
              className="flex items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
              to="/agent/profile"
            >
              <div className="flex">
                <LuUser2 className="size-6" />
              </div>
            </Link>



            <div className="flex">
              <ProfileDropdown />
            </div>



            <Link
              className="flex items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
              to="/"
              onClick={() => {
                logout();
              }}
            >
              <div className="flex">
                <LuLogOut className="size-6" />
              </div>
            </Link>
          </div>
        </nav>
      </div>

      <AgentMenu />
    </header>
  );
};

export default TopBar;
