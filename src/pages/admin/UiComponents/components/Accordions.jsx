import { ComponentContainerCard } from "@/components";
import { cn } from "@/utils";
import { LuChevronDown, LuMinus, LuPlus } from "react-icons/lu";

const AccordionExample = () => {
  return (
    <ComponentContainerCard title="Accordion Example">
      <div className="flex flex-wrap items-center gap-2">
        <div className="hs-accordion-group">
          {Array.from(new Array(3)).map((_val, idx) => {
            return (
              <div
                key={idx}
                className={cn("hs-accordion", idx === 0 && "active")}
              >
                <button
                  className="hs-accordion-toggle inline-flex w-full items-center gap-x-3 rounded-lg py-3 text-start font-semibold text-default-800 hover:text-default-950 disabled:pointer-events-none disabled:opacity-50 hs-accordion-active:text-primary"
                  aria-controls="hs-basic-collapse-one"
                >
                  <LuMinus className="hidden size-4 hs-accordion-active:block" />
                  <LuPlus className="size-4 hs-accordion-active:hidden" />
                  Accordion #{idx + 1}
                </button>
                <div
                  className={cn(
                    "hs-accordion-content w-full overflow-hidden transition-[height] duration-300",
                    idx != 0 && "hidden"
                  )}
                >
                  <p className="text-default-800">
                    <em>This is the third item's accordion body.</em> It is
                    hidden by default, until the collapse plugin adds the
                    appropriate classes that we use to style each element. These
                    classes control the overall appearance, as well as the
                    showing and hiding via CSS transitions.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ComponentContainerCard>
  );
};

const CardAccordion = () => {
  const faqs = [
    "What is Lorem Ipsum?",
    " Why do we use it?",
    "Where does it come from?",
  ];
  return (
    <ComponentContainerCard title="Card Accordion">
      <div>
        <div className="hs-accordion-group space-y-3">
          {faqs.map((faq, idx) => {
            return (
              <div key={idx} className="rounded-md border border-default-200">
                <div className={cn("hs-accordion", { active: idx === 0 })}>
                  <button
                    className="hs-accordion-toggle group inline-flex w-full items-center gap-x-3 p-3 text-left font-semibold text-default-600 transition hover:text-default-950"
                    aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-one"
                  >
                    {faq}
                    <LuChevronDown className="ms-auto size-4 transition-all hs-accordion-active:rotate-180" />
                  </button>
                  <div
                    className={cn(
                      "hs-accordion-content w-full overflow-hidden transition-[height] duration-300",
                      { hidden: idx != 0 }
                    )}
                    aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-one"
                  >
                    <div className="border-t border-default-200 p-3">
                      <p className="text-default-800">
                        Anim pariatur cliche reprehenderit, enim eiusmod high
                        life accusamus terry richardson ad squid. 3 wolf moon
                        officia aute, non cupidatat skateboard dolor brunch.
                        Food truck quinoa nesciunt laborum eiusmod. Brunch 3
                        wolf moon tempor, sunt aliqua put a bird on it squid
                        single-origin coffee nulla assumenda shoreditch et.
                        Nihil anim keffiyeh helvetica, craft beer labore wes
                        anderson cred nesciunt sapiente ea proident. Ad vegan
                        excepteur butcher vice lomo. Leggings occaecat craft
                        beer farm-to-table, raw denim aesthetic synth nesciunt
                        you probably haven't heard of them accusamus labore
                        sustainable VHS.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ComponentContainerCard>
  );
};

const Accordions = () => {
  return (
    <div id="accordions" className="scroll-mt-40">
      <h4 className="mb-4 text-xl text-default-900">Accordions</h4>
      <div className="space-y-4">
        <AccordionExample />
        <CardAccordion />
      </div>
    </div>
  );
};

export default Accordions;
