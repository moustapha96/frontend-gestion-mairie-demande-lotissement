import { ComponentContainerCard } from "@/components";
import { toSentenceCase } from "@/helpers";
import { Link } from "react-router-dom";

const Popovers = () => {
  const placements = ["top", "bottom", "left", "right"];
  return (
    <div id="popover" className="scroll-mt-40">
      <h4 className="mb-4 text-xl text-default-900">Popover</h4>
      <div className="space-y-4">
        <ComponentContainerCard title="Popovers">
          <div className="flex flex-wrap gap-3">
            {placements.map((placement, idx) => {
              return (
                <div
                  key={idx}
                  className={`hs-tooltip inline-block [--placement:${placement}] [--trigger:click]`}
                >
                  <Link className="hs-tooltip-toggle block text-center" to="">
                    <div className="inline-block rounded-md border border-primary bg-primary px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white hover:border-primary-700 hover:bg-primary-700">
                      Popover on {toSentenceCase(placement)}
                    </div>
                    <div
                      className="hs-tooltip-content relative z-50 hidden w-60 rounded border bg-default-800 px-3 py-1 font-medium text-default-200 opacity-0 transition-opacity hs-tooltip-shown:visible hs-tooltip-shown:opacity-100"
                      role="tooltip"
                    >
                      Vivamus sagittis lacus vel augue laoreet rutrum faucibus.
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </ComponentContainerCard>
      </div>
    </div>
  );
};

export default Popovers;
