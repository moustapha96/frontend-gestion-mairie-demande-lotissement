import { AdminBreadcrumb } from "@/components";
import Buttons from "./components/Buttons";
import Badges from "./components/Badges";
import Alerts from "./components/Alerts";
import Dropdowns from "./components/Dropdowns";
import Accordions from "./components/Accordions";
import NavTabs from "./components/NavTabs";
import Pagination from "./components/Pagination";
import Modals from "./components/Modals";
import Popovers from "./components/Popovers";
import Tooltips from "./components/Tooltips";
import FloatingMenu from "./components/FloatingMenu";

const UIComponents = () => {
  return (
    <>
      <AdminBreadcrumb title="Ui Components" />
      <section className="pb-10">
        <div className="container relative">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <div className="space-y-6">
                <Buttons />
                <Badges />
                <Alerts />
                <Dropdowns />
                <Accordions />
                <NavTabs />
                <Pagination />
                <Modals />
                <Popovers />
                <Tooltips />
              </div>
            </div>
            <div className="col-span-1 hidden md:block">
              <FloatingMenu />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UIComponents;
