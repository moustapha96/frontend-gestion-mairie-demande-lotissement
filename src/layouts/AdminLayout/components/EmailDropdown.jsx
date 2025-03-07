import { Link } from "react-router-dom";
import { messages } from "../data";
import { LuMail } from "react-icons/lu";

const EmailDropdown = () => {
  return (
    <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
      <button
        id="hs-dropdown-with-header"
        type="button"
        className="hs-dropdown-toggle inline-flex size-9 flex-shrink-0 items-center justify-center gap-2 rounded-md align-middle font-medium text-zinc-200 transition-all duration-300 hover:bg-white/10"
      >
        <LuMail className="size-5" />
        <span className="absolute -end-0 -top-0 size-4 rounded-full bg-primary text-xs font-medium text-white">
          2
        </span>
      </button>
      <div className="hs-dropdown-menu duration mt-2 hidden min-w-[20rem] rounded-lg border border-default-200 bg-white opacity-0 shadow-md transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:bg-default-50">
        <div className="flex items-center justify-between px-4 py-3">
          <h6 className="text-base font-semibold text-default-900">Messages</h6>
          <Link
            to=""
            className="border-b border-dashed border-default-300 font-semibold text-default-800"
          >
            <small>Clear All</small>
          </Link>
        </div>
        <div className="h-52 overflow-y-auto border-y border-dashed border-default-200 py-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-default-300 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
          {messages.map((message, idx) => {
            const Icon = message.icon;
            return (
              <Link
                to=""
                key={idx}
                className="mx-2 flex items-center rounded px-2 py-4 transition-all duration-200 hover:bg-default-100"
              >
                <span
                  className={`inline-flex size-9 items-center justify-center rounded-full bg-${message.variant}/20 text-${message.variant}`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="px-3">
                  <h6 className="text-sm font-semibold text-default-800">
                    {message.title}
                  </h6>
                  <p className="text-xs text-default-600">
                    {message.description}
                  </p>
                </span>
              </Link>
            );
          })}
        </div>
        <Link
          to=""
          className="block px-4 py-3 text-center text-sm font-medium text-primary"
        >
          View All
        </Link>
      </div>
    </div>
  );
};

export default EmailDropdown;
