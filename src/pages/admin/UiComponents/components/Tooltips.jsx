import { ComponentContainerCard } from "@/components";
import { Link } from "react-router-dom";

const Tooltips = () => {
  return (
    <div id="tooltip" className="scroll-mt-40">
      <h4 className="mb-4 text-xl text-default-900">Tooltip</h4>
      <div className="space-y-4">
        <ComponentContainerCard title="Tooltips">
          <div className="flex flex-wrap gap-3">
            <div className="hs-tooltip inline-block [--placement:top] [--trigger:hover]">
              <Link className="hs-tooltip-toggle block text-center" to="">
                <div className="inline-block rounded-md border border-primary bg-primary px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white hover:border-primary-700 hover:bg-primary-700">
                  Tooltip on Top
                </div>
                <div
                  className="hs-tooltip-content relative z-50 hidden rounded bg-default-800 px-3 py-1 font-semibold text-default-200 opacity-0 transition-opacity hs-tooltip-shown:visible hs-tooltip-shown:opacity-100"
                  role="tooltip"
                >
                  Top Tooltip
                  <div className="absolute -bottom-1 start-1/2 -z-10 h-2.5 w-2.5 rotate-45 rounded-[1px] bg-default-800" />
                </div>
              </Link>
            </div>
            <div className="hs-tooltip show inline-block [--trigger:hover] [--placement:bottom]">
              <Link className="hs-tooltip-toggle block text-center" to="">
                <div className="inline-block rounded-md border border-primary bg-primary px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white hover:border-primary-700 hover:bg-primary-700">
                  Tooltip on Bottom
                </div>
                <div
                  className="hs-tooltip-content relative z-50 hidden rounded bg-default-800 px-3 py-1 font-semibold text-default-200 opacity-0 transition-opacity hs-tooltip-shown:visible hs-tooltip-shown:opacity-100"
                  role="tooltip"
                >
                  Bottom Tooltip
                  <div className="absolute -top-1 start-1/2 -z-10 h-2.5 w-2.5 rotate-45 rounded-[1px] bg-default-800" />
                </div>
              </Link>
            </div>
            <div className="hs-tooltip show inline-block [--trigger:hover] [--placement:left]">
              <Link className="hs-tooltip-toggle block text-center" to="">
                <div className="inline-block rounded-md border border-primary bg-primary px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white hover:border-primary-700 hover:bg-primary-700">
                  Tooltip on Left
                </div>
                <div
                  className="hs-tooltip-content relative z-50 hidden rounded bg-default-800 px-3 py-1 font-semibold text-default-200 opacity-0 transition-opacity hs-tooltip-shown:visible hs-tooltip-shown:opacity-100"
                  role="tooltip"
                >
                  Left Tooltip
                  <div className="absolute -end-1 top-1/3 -z-10 h-2.5 w-2.5 rotate-45 rounded-[1px] bg-default-800 rtl:-start-1" />
                </div>
              </Link>
            </div>
            <div className="hs-tooltip inline-block [--trigger:hover] [--placement:right]">
              <Link className="hs-tooltip-toggle block text-center" to="">
                <div className="inline-block rounded-md border border-primary bg-primary px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white hover:border-primary-700 hover:bg-primary-700">
                  Tooltip on Right
                </div>
                <div
                  className="hs-tooltip-content relative z-50 hidden rounded bg-default-800 px-3 py-1 font-semibold text-default-200 opacity-0 transition-opacity hs-tooltip-shown:visible hs-tooltip-shown:opacity-100"
                  role="tooltip"
                >
                  Right Tooltip
                  <div className="absolute -start-1 top-1/3 -z-10 h-2.5 w-2.5 rotate-45 rounded-[1px] bg-default-800 rtl:-end-1" />
                </div>
              </Link>
            </div>
          </div>
        </ComponentContainerCard>
      </div>
    </div>
  );
};

export default Tooltips;
