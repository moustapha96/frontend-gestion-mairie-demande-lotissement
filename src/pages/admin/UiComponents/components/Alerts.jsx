import { ComponentContainerCard } from "@/components";
import {
  LuAlertOctagon,
  LuAlertTriangle,
  LuCheckCircle,
  LuCircleDotDashed,
  LuSkull,
} from "react-icons/lu";
import { Link } from "react-router-dom";

const DefaultAlerts = () => {
  return (
    <ComponentContainerCard title="Alerts">
      <div className="flex flex-col flex-wrap gap-2">
        <div
          className="w-full rounded-md bg-primary px-4 py-3 text-sm text-white"
          role="alert"
        >
          <b>Primary</b> alert! You should check in on some of those fields
          below.
        </div>
        <div
          className="w-full rounded-md bg-gray-500 px-4 py-3 text-sm text-white"
          role="alert"
        >
          <b>Gray</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md bg-emerald-600 px-4 py-3 text-sm text-white"
          role="alert"
        >
          <b>Emerald</b> alert! You should check in on some of those fields
          below.
        </div>
        <div
          className="w-full rounded-md bg-red-600 px-4 py-3 text-sm text-white"
          role="alert"
        >
          <b>Red</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm text-white"
          role="alert"
        >
          <b>Blue</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md bg-yellow-600 px-4 py-3 text-sm text-white"
          role="alert"
        >
          <b>Yellow</b> alert! You should check in on some of those fields
          below.
        </div>
        <div
          className="w-full rounded-md bg-sky-600 px-4 py-3 text-sm text-white"
          role="alert"
        >
          <b>Sky</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md bg-cyan-600 px-4 py-3 text-sm text-white"
          role="alert"
        >
          <b>Cyan</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md bg-gray-800 px-4 py-3 text-sm text-white"
          role="alert"
        >
          <b>Dark</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md bg-gray-100 px-4 py-2.5 text-sm text-gray-900"
          role="alert"
        >
          <b>Light</b> alert! You should check in on some of those fields below.
        </div>
      </div>
    </ComponentContainerCard>
  );
};

const OutlineAlerts = () => {
  return (
    <ComponentContainerCard title="Outline Alerts">
      <div className="flex flex-col flex-wrap gap-2">
        <div
          className="w-full rounded-md border border-primary px-4 py-3 text-sm text-primary"
          role="alert"
        >
          <b>Primary</b> alert! You should check in on some of those fields
          below.
        </div>
        <div
          className="w-full rounded-md border border-gray-500 px-4 py-3 text-sm text-gray-500"
          role="alert"
        >
          <b>Gray</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md border border-emerald-600 px-4 py-3 text-sm text-emerald-600"
          role="alert"
        >
          <b>Emerald</b> alert! You should check in on some of those fields
          below.
        </div>
        <div
          className="w-full rounded-md border border-red-600 px-4 py-3 text-sm text-red-600"
          role="alert"
        >
          <b>Red</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md border border-blue-600 px-4 py-3 text-sm text-blue-600"
          role="alert"
        >
          <b>Blue</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md border border-yellow-600 px-4 py-3 text-sm text-yellow-600"
          role="alert"
        >
          <b>Yellow</b> alert! You should check in on some of those fields
          below.
        </div>
        <div
          className="w-full rounded-md border border-sky-600 px-4 py-3 text-sm text-sky-600"
          role="alert"
        >
          <b>Sky</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md border border-cyan-600 px-4 py-3 text-sm text-cyan-600"
          role="alert"
        >
          <b>Cyan</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md border border-gray-800 px-4 py-3 text-sm text-gray-800"
          role="alert"
        >
          <b>Dark</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md border border-gray-100 px-4 py-2.5 text-sm text-gray-100"
          role="alert"
        >
          <b>Light</b> alert! You should check in on some of those fields below.
        </div>
      </div>
    </ComponentContainerCard>
  );
};

const SoftAlerts = () => {
  return (
    <ComponentContainerCard title="Soft Alerts">
      <div className="flex flex-col flex-wrap gap-2">
        <div
          className="w-full rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary"
          role="alert"
        >
          <b>Primary</b> alert! You should check in on some of those fields
          below.
        </div>
        <div
          className="w-full rounded-md border border-gray-500/20 bg-gray-500/10 px-4 py-3 text-sm text-gray-500"
          role="alert"
        >
          <b>Gray</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md border border-emerald-600/20 bg-emerald-600/10 px-4 py-3 text-sm text-emerald-600"
          role="alert"
        >
          <b>Emerald</b> alert! You should check in on some of those fields
          below.
        </div>
        <div
          className="w-full rounded-md border border-red-600/20 bg-red-600/10 px-4 py-3 text-sm text-red-600"
          role="alert"
        >
          <b>Red</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md border border-blue-600/20 bg-blue-600/10 px-4 py-3 text-sm text-blue-600"
          role="alert"
        >
          <b>Blue</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md border border-yellow-600/20 bg-yellow-600/10 px-4 py-3 text-sm text-yellow-600"
          role="alert"
        >
          <b>Yellow</b> alert! You should check in on some of those fields
          below.
        </div>
        <div
          className="w-full rounded-md border border-sky-600/20 bg-sky-600/10 px-4 py-3 text-sm text-sky-600"
          role="alert"
        >
          <b>Sky</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md border border-cyan-600/20 bg-cyan-600/10 px-4 py-3 text-sm text-cyan-600"
          role="alert"
        >
          <b>Cyan</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md border border-gray-800/20 bg-gray-800/10 px-4 py-3 text-sm text-gray-800"
          role="alert"
        >
          <b>Dark</b> alert! You should check in on some of those fields below.
        </div>
        <div
          className="w-full rounded-md border border-gray-100/20 bg-gray-100/10 px-4 py-2.5 text-sm text-gray-100"
          role="alert"
        >
          <b>Light</b> alert! You should check in on some of those fields below.
        </div>
      </div>
    </ComponentContainerCard>
  );
};

const AlertWithIcon = () => {
  return (
    <ComponentContainerCard title="Alert with icon">
      <div className="flex flex-col flex-wrap gap-2">
        <div
          className="inline-flex w-full items-center rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary"
          role="alert"
        >
          <LuCircleDotDashed className="me-2 size-4" />
          <span>
            <b>Primary</b> alert! You should check in on some of those fields
            below.
          </span>
        </div>
        <div
          className="inline-flex w-full items-center rounded-md border border-emerald-600/20 bg-emerald-600/10 px-4 py-3 text-sm text-emerald-600"
          role="alert"
        >
          <LuCheckCircle className="me-2 size-4" />
          <span>
            <b>Emerald</b> alert! You should check in on some of those fields
            below.
          </span>
        </div>
        <div
          className="inline-flex w-full items-center rounded-md border border-red-600/20 bg-red-600/10 px-4 py-3 text-sm text-red-600"
          role="alert"
        >
          <LuSkull className="me-2 size-4" />
          <span>
            <b>Red</b> alert! You should check in on some of those fields below.
          </span>
        </div>
        <div
          className="inline-flex w-full items-center rounded-md border border-yellow-600/20 bg-yellow-600/10 px-4 py-3 text-sm text-yellow-600"
          role="alert"
        >
          <LuAlertTriangle className="me-2 size-4" />
          <span>
            <b>Yellow</b> alert! You should check in on some of those fields
            below.
          </span>
        </div>
        <div
          className="inline-flex w-full items-center rounded-md border border-sky-600/20 bg-sky-600/10 px-4 py-3 text-sm text-sky-600"
          role="alert"
        >
          <LuAlertOctagon className="me-2 size-4" />
          <span>
            <b>Sky</b> alert! You should check in on some of those fields below.
          </span>
        </div>
      </div>
    </ComponentContainerCard>
  );
};

const AlertWithLink = () => {
  return (
    <ComponentContainerCard title="Alert with Link">
      <div className="flex flex-col flex-wrap gap-2">
        <div
          className="w-full rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary"
          role="alert"
        >
          <b>Primary</b> alert! You should check
          <Link to="" className="font-bold">
            Click Here
          </Link>
        </div>
        <div
          className="w-full rounded-md border border-emerald-600/20 bg-emerald-600/10 px-4 py-3 text-sm text-emerald-600"
          role="alert"
        >
          <b>Emerald</b> alert! You should check
          <Link to="" className="font-bold">
            Click Here
          </Link>
        </div>
        <div
          className="w-full rounded-md border border-red-600/20 bg-red-600/10 px-4 py-3 text-sm text-red-600"
          role="alert"
        >
          <b>Red</b> alert! You should check
          <Link to="" className="font-bold">
            Click Here
          </Link>
        </div>
        <div
          className="w-full rounded-md border border-yellow-600/20 bg-yellow-600/10 px-4 py-3 text-sm text-yellow-600"
          role="alert"
        >
          <b>Yellow</b> alert! You should check
          <Link to="" className="font-bold">
            Click Here
          </Link>
        </div>
        <div
          className="w-full rounded-md border border-sky-600/20 bg-sky-600/10 px-4 py-3 text-sm text-sky-600"
          role="alert"
        >
          <b>Sky</b> alert! You should check
          <Link to="" className="font-bold">
            Click Here
          </Link>
        </div>
      </div>
    </ComponentContainerCard>
  );
};

const Alerts = () => {
  return (
    <div id="alerts" className="scroll-mt-40">
      <h4 className="mb-4 text-xl text-default-900">Alerts</h4>
      <div className="space-y-4">
        <DefaultAlerts />
        <OutlineAlerts />
        <SoftAlerts />
        <AlertWithIcon />
        <AlertWithLink />
      </div>
    </div>
  );
};

export default Alerts;
