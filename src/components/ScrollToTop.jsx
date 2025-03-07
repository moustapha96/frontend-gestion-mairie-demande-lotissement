import { useLayoutContext } from "@/context";
import { useScrollEvent } from "@/hooks";
import { LuChevronUp, LuMoon, LuSun } from "react-icons/lu";

const ScrollToTop = () => {
  const { scrollY } = useScrollEvent();

  const { themeMode, updateTheme } = useLayoutContext();

  const toggleThemeMode = () => {
    updateTheme(themeMode === "light" ? "dark" : "light");
  };

  return (
    <div className="fixed bottom-5 end-5 flex flex-col gap-1 items-center z-[40]">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`h-10 w-10 bg-primary/20 backdrop-blur-3xl rounded-full text-primary flex justify-center items-center transition-all duration-500 shadow-[inset_0px_0px_12px_0px] shadow-primary/40 z-10 ${scrollY < 72 && "translate-x-16"
          }`}
      >
        <LuChevronUp className="h-4 w-4" />
      </button>
      <button className="bg-primary text-white rounded-lg z-20">
        <span
          className="h-9 w-9 flex justify-center items-center"
          onClick={toggleThemeMode}
          id="dark-theme"
        >
          {themeMode === "dark" ? (
            <LuSun className="h-5 w-5" />
          ) : (
            <LuMoon className="h-5 w-5" />
          )}
        </span>
      </button>
    </div>
  );
};

export default ScrollToTop;
