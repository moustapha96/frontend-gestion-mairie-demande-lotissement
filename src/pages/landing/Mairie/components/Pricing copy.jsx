import { LuMoveRight } from "react-icons/lu";
import PricingCard from "./PricingCard";
import { pricingPlans } from "../data";

const Pricing = () => {
  return (
    <section id="pricing" className="lg:py-20 py-10">
      <div className="container">
        <div className="grid xl:grid-cols-5 gap-6">
          <div className="xl:col-span-2">
            <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">
              Pricing
            </span>
            <h2 className="text-4xl font-medium text-default-950 mt-6">
              Affordable Pricing. <br /> Easy scaling.
            </h2>
            <hr className="my-6 border border-dashed text-default-800 hidden xl:block" />
            <p className="text-base">
              Things go wrong have questions. We’ve understand. So we have
              people
            </p>
            <ul role="list" className="mt-4 text-sm text-default-white">
              <li className="flex items-center gap-2 py-1">
                <LuMoveRight className="inline-block h-6 w-6 stroke-primary" />
                <span className="text-base text-default-950">
                  Amazing communication.
                </span>
              </li>
              <li className="flex items-center gap-2 py-1">
                <LuMoveRight className="inline-block h-6 w-6 stroke-primary" />
                <span className="text-base text-default-950">
                  Best trendinf designing experience.
                </span>
              </li>
              <li className="flex items-center gap-2 py-1">
                <LuMoveRight className="inline-block h-6 w-6 stroke-primary" />
                <span className="text-base text-default-950">
                  Email &amp; Live chat.
                </span>
              </li>
            </ul>
          </div>
          <div className="xl:col-span-3 mt-8 lg:mt-0">
            <div className="lg:ms-8">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-10 gap-y-6">
                {pricingPlans.map((plan, idx) => (
                  <PricingCard key={idx} pricingPlan={plan} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
