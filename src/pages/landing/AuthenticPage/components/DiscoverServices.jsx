import { useLayoutContext } from "@/context";
import { LuMoveRight } from "react-icons/lu";
import { Link } from "react-router-dom";

import bgLine from "@/assets/images/other/bg-lines-2.png";
import bgLineDark from "@/assets/images/other/bg-lines-2-dark.png";

const DiscoverServices = () => {
  const { themeMode } = useLayoutContext();

  return (
    <section className="py-10 lg:py-20">
      <div className="container">
        <div className="max-w-xl mx-auto text-center mb-12">
          <h2 className="md:text-4xl text-3xl font-medium text-default-950">
            Didn't find the answer you were looking for?
          </h2>
          <div className="relative mx-auto w-full lg:w-96 mt-6">
            <div className="group">
              <div className="w-full group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500">
                <div className="bg-primary flex items-center justify-center h-[68px] p-6 relative z-10">
                  <Link className="text-xl text-white bg-primary" to="">
                    Feel free to submit your question
                  </Link>
                </div>
              </div>
              <div className="absolute bg-default-950 h-full left-0 top-0 w-full -z-10" />
            </div>
          </div>
        </div>
        <div className="bg-default-100 dark:bg-default-50">
          <div
            className="md:p-20 p-10 text-center bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url(${
                themeMode == "light" ? bgLine : bgLineDark
              })`,
            }}
          >
            <h2 className="md:text-4xl text-3xl font-medium text-default-950">
              Sign up today for top-notch web hosting services.
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-7">
              <Link
                to=""
                className="inline-flex gap-2 md:text-xl items-center relative text-default-950 hover:text-primary group"
              >
                <span className="absolute h-px w-7/12 group-hover:w-full transition-all duration-500 rounded bg-default-50 group-hover:bg-primary -bottom-0" />
                Discover more by clicking here
                <LuMoveRight className="h-5 w-5" />
              </Link>
              <div className="relative">
                <div className="group">
                  <div className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500 relative z-10">
                    <div className="bg-primary py-2 px-6">
                      <Link className="text-xl text-white bg-primary" to="">
                        Get Started
                      </Link>
                    </div>
                  </div>
                  <div className="absolute bg-default-950 h-full left-0 top-0 w-full z-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverServices;
