import { LuSearch } from "react-icons/lu";
import { useLayoutContext } from "@/context";

import bgLine from "@/assets/images/other/bg-lines-2.png";
import bgLineDark from "@/assets/images/other/bg-lines-2-dark.png";

const DomainNames = () => {
  const { themeMode } = useLayoutContext();
  return (
    <section className="py-10 lg:py-20">
      <div className="container">
        <div className="bg-default-100 dark:bg-default-50">
          <div
            className="py-20 px-6 bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url(${
                themeMode == "light" ? bgLine : bgLineDark
              })`,
            }}
          >
            <div className="mx-auto text-center">
              <span className="text-sm uppercase text-default-950">
                Domain names
              </span>
              <h2 className="md:text-4xl text-3xl font-medium text-default-950 mt-5">
                Every exceptional website deserves a remarkable name.
              </h2>
              <p className="text-base text-default-950 mt-6">
                Your domain name is the address of your website. While <br />{" "}
                .com names are widely favored, consider options like <br />{" "}
                .org, .tech, .co, and beyond.
              </p>
              <form className="max-w-xl mx-auto space-y-2 mt-6">
                <div className="relative">
                  <input
                    type="email"
                    id="subcribe"
                    className="bg-white py-4 ps-4 pe-16 w-full h-12 text-default-950 border-default-200 focus:ring-0 focus:border-default-200 dark:bg-default-50"
                    placeholder="Type Your Email"
                    name="email"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-3 absolute top-[6px] end-[6px] h-9"
                  >
                    <LuSearch className="h-6 w-6 text-default-950" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DomainNames;
