import { ComponentContainerCard } from "@/components";

const tabContent = [
  "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi.",
  "Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.",
  "Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna.",
];

const HorizontalNavTabs = () => {
  return (
    <ComponentContainerCard title="Horizontal Nav Tabs">
      <div className="flex flex-col flex-wrap items-start gap-2">
        <div className="flex">
          <nav
            className="flex w-full items-center justify-center gap-2"
            aria-label="Tabs"
            role="tablist"
          >
            <button
              type="button"
              className="active inline-flex items-center justify-center gap-x-2 rounded-lg bg-default-200 px-6 py-2.5 text-sm font-medium text-default-500 hover:text-default-700 disabled:pointer-events-none disabled:opacity-50 hs-tab-active:bg-primary hs-tab-active:text-white"
              id="segment-item-1"
              data-hs-tab="#segment-1"
              aria-controls="segment-1"
              role="tab"
            >
              Tab 1
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-x-2 rounded-lg bg-default-200 px-6 py-2.5 text-sm font-medium text-default-500 hover:text-default-700 disabled:pointer-events-none disabled:opacity-50 hs-tab-active:bg-primary hs-tab-active:text-white"
              id="segment-item-2"
              data-hs-tab="#segment-2"
              aria-controls="segment-2"
              role="tab"
            >
              Tab 2
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-x-2 rounded-lg bg-default-200 px-6 py-2.5 text-sm font-medium text-default-500 hover:text-default-700 disabled:pointer-events-none disabled:opacity-50 hs-tab-active:bg-primary hs-tab-active:text-white"
              id="segment-item-3"
              data-hs-tab="#segment-3"
              aria-controls="segment-3"
              role="tab"
            >
              Tab 3
            </button>
          </nav>
        </div>
        <div className="mt-3">
          {tabContent.map((content, idx) => {
            return (
              <div
                id={`segment-${idx + 1}`}
                key={idx}
                className={idx === 0 ? "" : "hidden"}
                role="tabpanel"
                aria-labelledby={`segment-item-${idx + 1}`}
              >
                <p className="text-default-500">{content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </ComponentContainerCard>
  );
};
const VerticalNavTabs = () => {
  return (
    <ComponentContainerCard title="Vertical Nav Tabs">
      <div className="grid grid-cols-4 gap-6">
        <div className="flex">
          <nav
            className="flex w-full flex-col gap-2"
            aria-label="Tabs"
            role="tablist"
          >
            <button
              type="button"
              className="active inline-flex items-center justify-center gap-x-2 rounded-lg bg-default-200 px-6 py-2.5 text-sm font-medium text-default-500 hover:text-default-700 disabled:pointer-events-none disabled:opacity-50 hs-tab-active:bg-primary hs-tab-active:text-white"
              id="vr-item-1"
              data-hs-tab="#vr-1"
              aria-controls="vr-1"
              role="tab"
            >
              Tab 1
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-x-2 rounded-lg bg-default-200 px-6 py-2.5 text-sm font-medium text-default-500 hover:text-default-700 disabled:pointer-events-none disabled:opacity-50 hs-tab-active:bg-primary hs-tab-active:text-white"
              id="vr-item-2"
              data-hs-tab="#vr-2"
              aria-controls="vr-2"
              role="tab"
            >
              Tab 2
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-x-2 rounded-lg bg-default-200 px-6 py-2.5 text-sm font-medium text-default-500 hover:text-default-700 disabled:pointer-events-none disabled:opacity-50 hs-tab-active:bg-primary hs-tab-active:text-white"
              id="vr-item-3"
              data-hs-tab="#vr-3"
              aria-controls="vr-3"
              role="tab"
            >
              Tab 3
            </button>
          </nav>
        </div>
        <div className="col-span-3">
          {tabContent.map((content, idx) => {
            return (
              <div
                key={idx}
                id={`vr-${idx + 1}`}
                className={idx === 0 ? "" : "hidden"}
                role="tabpanel"
                aria-labelledby={`vr-item-${idx + 1}`}
              >
                <p className="text-default-500">{content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </ComponentContainerCard>
  );
};

const NavTabs = () => {
  return (
    <div id="nav-tabs" className="scroll-mt-40">
      <h4 className="mb-4 text-xl text-default-900">Nav Tabs</h4>
      <div className="space-y-4">
        <HorizontalNavTabs />
        <VerticalNavTabs />
      </div>
    </div>
  );
};

export default NavTabs;
