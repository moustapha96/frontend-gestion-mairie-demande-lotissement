import { LuLayoutGrid } from "react-icons/lu";
import { apps } from "../data";
import { Link } from "react-router-dom";

const AppsDropdown = () => {
  return (
    <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
      <button
        id="hs-dropdown-with-header"
        type="button"
        className="hs-dropdown-toggle inline-flex size-9 flex-shrink-0 items-center justify-center gap-2 rounded-md align-middle font-medium text-zinc-200 transition-all duration-300 hover:bg-white/10"
      >
        <LuLayoutGrid className="size-5" />
      </button>
      <div className="hs-dropdown-menu duration mt-2 hidden min-w-[12rem] rounded-lg border border-default-200 bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:bg-default-50">
        <div className="grid grid-cols-3 gap-3">
          {apps.map((app, idx) => {
            return (
              <Link
                key={idx}
                className="flex flex-col items-center justify-center gap-1.5 rounded-md px-6 py-3 text-sm text-default-800 hover:bg-default-100"
                to=""
              >
                <img src={app.image} className="h-6" alt="Github" />
                <span>{app.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AppsDropdown;
