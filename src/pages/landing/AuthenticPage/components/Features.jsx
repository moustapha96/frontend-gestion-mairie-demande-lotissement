import hosting3 from "@/assets/images/landing/hosting/3.svg";
import hosting5 from "@/assets/images/landing/hosting/5.svg";
import { LuMoveRight } from "react-icons/lu";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <>
      <section id="features" className="py-10 lg:py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <img src={hosting5} />
            </div>
            <div>
              <span className="text-sm uppercase text-default-950">
                Trusted security
              </span>
              <h2 className="md:text-4xl text-3xl font-medium text-default-950 my-5">
                Reliable security right from the start.
              </h2>
              <p className="text-base text-default-950 mb-5">
                Lorem ipsum originated from the scrambled, Latin text of
                Cicero's 1st-century BC work, De Finibus, and has since become
                ubiquitous lorem ipsum.
              </p>
              <Link
                to=""
                className="inline-flex gap-2 text-xl items-center relative text-primary group"
              >
                <span className="absolute h-px w-7/12 group-hover:w-full transition-all duration-500 rounded bg-primary/80 -bottom-0" />
                Discover more by clicking here
                <LuMoveRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-10 lg:py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <span className="text-sm uppercase text-default-950">
                Site transfer
              </span>
              <h2 className="md:text-4xl text-3xl font-medium text-default-950 my-5">
                Seamless migration with lightning speed and zero downtime.
              </h2>
              <p className="text-base text-default-950 mb-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <Link
                to=""
                className="inline-flex gap-2 text-xl items-center relative text-primary group"
              >
                <span className="absolute h-px w-7/12 group-hover:w-full transition-all duration-500 rounded bg-primary/80 -bottom-0" />
                Discover more by clicking here
                <LuMoveRight className="h-5 w-5" />
              </Link>
            </div>
            <div>
              <img src={hosting3} className="h-96" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
