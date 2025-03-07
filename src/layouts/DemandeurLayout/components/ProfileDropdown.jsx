import avatar1 from "@/assets/images/avatars/img-1.jpg";
import { LuLogOut, LuNewspaper, LuSettings, LuUser } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context";

const ProfileDropdown = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  return (
    <div className="hs-dropdown relative inline-flex">
      <button
        id="hs-dropdown-with-header"
        type="button"
        onClick={() => { navigate('/demandeur/profile') }}
        className="hs-dropdown-toggle inline-flex flex-shrink-0 items-center justify-center gap-2 align-middle text-xs font-medium transition-all"
      >
        <img className="inline-block size-9 rounded-full" src={user?.avatar ? `data:image/jpeg;base64,${user?.avatar}` : avatar1} />
        <div className="hidden text-start lg:block">
          <p className="text-sm font-bold text-white"> {user.prenom + " " + user.nom}</p>
          <p className="mt-1 text-xs font-semibold text-zinc-400">Demandeur</p>
        </div>
      </button>
      <div className="hs-dropdown-menu duration mt-2 hidden min-w-[12rem] rounded-lg border border-default-200 bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:bg-default-50">
        <Link
          className="flex items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-default-800 transition-all hover:bg-default-100"
          to="/demandeur/profile"
        >
          <LuUser className="size-4" />
          Mon Profil
        </Link>


        <hr className="-mx-2 my-2 border-default-200" />
        <Link
          className="flex items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
          to="/auth/logout"
          onClick={() => {
            logout();
          }}
        >
          <LuLogOut className="size-4" />
          Déconnexion
        </Link>
      </div>
    </div>
  );
};

export default ProfileDropdown;
