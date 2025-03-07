import { floatingMenu } from "../data";
import Gumshoe from "gumshoejs";
import { useEffect } from "react";

const FloatingMenu = () => {
  useEffect(() => {
    initgumshoes();
  }, []);

  function initgumshoes() {
    if (document.querySelector("#ui-nav a")) {
      new Gumshoe("#ui-nav a", {
        offset: 150,
      });
    }
  }
  return (
    <div className="sticky top-40 rounded-lg border border-default-200 bg-white px-4 py-6 dark:bg-default-50">
      <ul className="sidebar-nav mb-0 flex flex-col gap-1 py-0" id="ui-nav">
        {floatingMenu.map((item, idx) => {
          return (
            <li className={"group p-0"} key={idx}>
              <a
                href={item.link}
                className="inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-1 text-base text-default-900 transition-all duration-500 hover:text-primary group-[.active]:border-primary/20 group-[.active]:bg-primary/5 group-[.active]:text-primary"
              >
                {item.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FloatingMenu;
