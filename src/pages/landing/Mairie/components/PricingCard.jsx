import { LuDot } from "react-icons/lu";
import { Link } from "react-router-dom";

const PricingCard = ({ pricingPlan }) => {
  const { features, name, price, subTitle, title } = pricingPlan;

  return (
    <div className="relative w-full lg:w-full mx-auto">
      <div className="group">
        <div className="border border-default-200 w-full group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500">
          <div className="p-6 bg-white dark:bg-default-50">
            <h5 className="text-2xl font-medium text-center text-default-950">
              {name}
            </h5>
            <p className="text-xs uppercase tracking-widest text-center text-default-950 mt-1">
              For individuals and teams
            </p>
            <div className="flex items-center gap-4 bg-default-100 text-default-950 p-5 mt-6">
              <h2 className="text-5xl font-semibold">
                <sup className="text-xl">$</sup>
                {price}
              </h2>
              <div>
                <p className="text-lg">{title}</p>
                <p className="text-xs">{subTitle}</p>
              </div>
            </div>
            <ul role="list" className="mt-3 text-sm text-default-700">
              {features.map((feature, idx) => {
                return (
                  <li key={idx} className="flex items-center gap-2">
                    <LuDot className="inline-block h-9 w-9 text-primary" />
                    <span className="text-default-950 text-base">
                      {feature}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="relative w-full lg:w-56 mx-auto mt-5 z-20">
              <div className="group">
                <div className="border border-default-200 group-hover:border-transparent w-full group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500">
                  <div className="flex items-center justify-center h-4 p-6 relative z-10 bg-primary">
                    <Link className="button bg-primary text-white" to="">
                      Get Started
                    </Link>
                  </div>
                </div>
                <div className="absolute bg-default-950 h-full left-0 top-0 w-full -z-10" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bg-default-950 h-full left-0 top-0 w-full -z-10" />
      </div>
    </div>
  );
};

export default PricingCard;
