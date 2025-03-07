import { LuEye, LuPartyPopper } from "react-icons/lu";
import { Link } from "react-router-dom";

import dashboardHero from "@/assets/images/other/dashboard-hero.png";

const ProgressCard = () => {
  return (
    <div className="overflow-hidden rounded-md border border-default-200 bg-white dark:bg-default-50">
      <div
        className="inline-flex w-full items-center bg-green-600/10 px-4 py-3 text-sm text-green-600"
        role="alert"
      >
        <LuPartyPopper className="me-2 size-4" />
        <span>Congratulations John.</span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-4 items-center justify-between">
          <div className="col-span-3 h-full">
            <div className="flex h-full flex-col items-start">
              <div className="mb-4 grow">
                <p className="text-lg text-default-900">
                  You have done <span>68%</span>😎 more sales today
                </p>
                <p className="text-base text-default-600">
                  Check your new badge in your profile.
                </p>
              </div>
              <Link
                to=""
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary-500 px-6 py-2 text-center text-sm text-white transition-all hover:bg-primary-600"
              >
                View Profile
                <LuEye className="ms-1 size-4" />
              </Link>
            </div>
          </div>
          <div>
            <img src={dashboardHero} className="h-full max-w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
