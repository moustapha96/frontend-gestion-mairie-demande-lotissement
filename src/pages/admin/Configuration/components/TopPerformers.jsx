import { Link } from "react-router-dom";
import { topPerformers } from "../data";
import { LuLogOut, LuMoreVertical, LuPencil, LuTrash2 } from "react-icons/lu";

const TopPerformers = () => {
  return (
    <div className="rounded-md border border-default-200 bg-white dark:bg-default-50">
      <div className="border-b border-default-200 px-6 py-3">
        <h4 className="text-lg text-default-900">Top Performers</h4>
      </div>
      <div className="h-[440px] divide-y divide-default-200 overflow-y-auto [&::-webkit-scrollbar-track]:!bg-transparent [&::-webkit-scrollbar]:w-1">
        {topPerformers.map((performer, idx) => {
          return (
            <div key={idx} className="flex items-center p-2.5">
              <img
                src={performer.image}
                className="me-3 h-12 rounded-full"
                alt="performer"
              />
              <div className="flex-grow">
                <h5 className="mt-1 text-default-900">{performer.name}</h5>
                <h6 className="mt-1 text-default-600">{performer.position}</h6>
              </div>
              <div className="h-4">
                <div className="hs-dropdown relative inline-flex [--placement:left-top] rtl:[--placement:bottom-left]">
                  <button type="button" className="hs-dropdown-toggle rounded">
                    <LuMoreVertical className="size-4" />
                  </button>
                  <div className="hs-dropdown-menu z-10 mt-4 hidden min-w-[200px] rounded-lg border border-default-100 bg-white py-1.5 opacity-0 shadow-lg transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:bg-default-50">
                    <Link
                      className="mx-1.5 flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700"
                      to=""
                    >
                      <LuPencil className="me-1.5 size-4" />
                      <span>Edit</span>
                    </Link>
                    <Link
                      className="mx-1.5 flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700"
                      to=""
                    >
                      <LuLogOut className="me-1.5 size-4" />
                      <span>Remove from Team</span>
                    </Link>
                    <hr className="my-2 border-default-200" />
                    <Link
                      className="mx-1.5 flex items-center rounded px-3 py-2 text-red-500 transition-all hover:bg-red-500/10"
                      to=""
                    >
                      <LuTrash2 className="me-1.5 size-4" />
                      <span>Delete</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopPerformers;
