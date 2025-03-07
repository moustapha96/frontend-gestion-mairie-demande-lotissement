import { ComponentContainerCard } from "@/components";

const DefaultBadges = () => {
  return (
    <ComponentContainerCard title="Default Badges">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white">
          Primary
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-600 px-3 py-1.5 text-xs font-medium text-white">
          Gray
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">
          Emerald
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white">
          Red
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">
          Blue
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-yellow-600 px-3 py-1.5 text-xs font-medium text-white">
          Yellow
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white">
          Sky
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white">
          Cyan
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white">
          Purple
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-800 px-3 py-1.5 text-xs font-medium text-white">
          Dark
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-900">
          Light
        </span>
      </div>
    </ComponentContainerCard>
  );
};

const RoundedBadges = () => {
  return (
    <ComponentContainerCard title="Rounded Badges">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white">
          Primary
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-gray-600 px-3 py-1.5 text-xs font-medium text-white">
          Gray
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">
          Emerald
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white">
          Red
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">
          Blue
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-yellow-600 px-3 py-1.5 text-xs font-medium text-white">
          Yellow
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-sky-600 px-3 py-1.5 text-xs font-medium text-white">
          Sky
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white">
          Cyan
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-purple-600 px-3 py-1.5 text-xs font-medium text-white">
          Purple
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-gray-800 px-3 py-1.5 text-xs font-medium text-white">
          Dark
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-900">
          Light
        </span>
      </div>
    </ComponentContainerCard>
  );
};

const OutlineBadges = () => {
  return (
    <ComponentContainerCard title="Outline Badges">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-primary px-3 py-1.5 text-xs font-medium text-primary">
          Primary
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-600">
          Gray
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-emerald-600 px-3 py-1.5 text-xs font-medium text-emerald-600">
          Emerald
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-red-600 px-3 py-1.5 text-xs font-medium text-red-600">
          Red
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-blue-600 px-3 py-1.5 text-xs font-medium text-blue-600">
          Blue
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-yellow-600 px-3 py-1.5 text-xs font-medium text-yellow-600">
          Yellow
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-sky-600 px-3 py-1.5 text-xs font-medium text-sky-600">
          Sky
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-cyan-600 px-3 py-1.5 text-xs font-medium text-cyan-600">
          Cyan
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-purple-600 px-3 py-1.5 text-xs font-medium text-purple-600">
          Purple
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-gray-800 px-3 py-1.5 text-xs font-medium text-gray-800">
          Dark
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-gray-100 px-3 py-1.5 text-xs font-medium text-gray-100">
          Light
        </span>
      </div>
    </ComponentContainerCard>
  );
};

const OutlineRoundedBadges = () => {
  return (
    <ComponentContainerCard title="Outline Rounded Badges">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-primary px-3 py-1.5 text-xs font-medium text-primary">
          Primary
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-600">
          Gray
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-emerald-600 px-3 py-1.5 text-xs font-medium text-emerald-600">
          Emerald
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-red-600 px-3 py-1.5 text-xs font-medium text-red-600">
          Red
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-blue-600 px-3 py-1.5 text-xs font-medium text-blue-600">
          Blue
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-yellow-600 px-3 py-1.5 text-xs font-medium text-yellow-600">
          Yellow
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-sky-600 px-3 py-1.5 text-xs font-medium text-sky-600">
          Sky
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-cyan-600 px-3 py-1.5 text-xs font-medium text-cyan-600">
          Cyan
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-purple-600 px-3 py-1.5 text-xs font-medium text-purple-600">
          Purple
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-gray-800 px-3 py-1.5 text-xs font-medium text-gray-800">
          Dark
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-gray-100 px-3 py-1.5 text-xs font-medium text-gray-100">
          Light
        </span>
      </div>
    </ComponentContainerCard>
  );
};

const SoftBadges = () => {
  return (
    <ComponentContainerCard title="Soft Badges">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          Primary
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-gray-600/20 bg-gray-600/10 px-3 py-1.5 text-xs font-medium text-gray-600">
          Gray
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-emerald-600/20 bg-emerald-600/10 px-3 py-1.5 text-xs font-medium text-emerald-600">
          Emerald
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-red-600/20 bg-red-600/10 px-3 py-1.5 text-xs font-medium text-red-600">
          Red
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-blue-600/20 bg-blue-600/10 px-3 py-1.5 text-xs font-medium text-blue-600">
          Blue
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-yellow-600/20 bg-yellow-600/10 px-3 py-1.5 text-xs font-medium text-yellow-600">
          Yellow
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-sky-600/20 bg-sky-600/10 px-3 py-1.5 text-xs font-medium text-sky-600">
          Sky
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-cyan-600/20 bg-cyan-600/10 px-3 py-1.5 text-xs font-medium text-cyan-600">
          Cyan
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-purple-600/20 bg-purple-600/10 px-3 py-1.5 text-xs font-medium text-purple-600">
          Purple
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-gray-800/20 bg-gray-800/10 px-3 py-1.5 text-xs font-medium text-gray-800">
          Dark
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-md border border-gray-100/20 bg-gray-100/10 px-3 py-1.5 text-xs font-medium text-gray-100">
          Light
        </span>
      </div>
    </ComponentContainerCard>
  );
};

const SoftRoundedBadges = () => {
  return (
    <ComponentContainerCard title="Soft Rounded Badges">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          Primary
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-gray-600/20 bg-gray-600/10 px-3 py-1.5 text-xs font-medium text-gray-600">
          Gray
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-emerald-600/20 bg-emerald-600/10 px-3 py-1.5 text-xs font-medium text-emerald-600">
          Emerald
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-red-600/20 bg-red-600/10 px-3 py-1.5 text-xs font-medium text-red-600">
          Red
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-blue-600/20 bg-blue-600/10 px-3 py-1.5 text-xs font-medium text-blue-600">
          Blue
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-yellow-600/20 bg-yellow-600/10 px-3 py-1.5 text-xs font-medium text-yellow-600">
          Yellow
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-sky-600/20 bg-sky-600/10 px-3 py-1.5 text-xs font-medium text-sky-600">
          Sky
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-cyan-600/20 bg-cyan-600/10 px-3 py-1.5 text-xs font-medium text-cyan-600">
          Cyan
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-purple-600/20 bg-purple-600/10 px-3 py-1.5 text-xs font-medium text-purple-600">
          Purple
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-gray-800/20 bg-gray-800/10 px-3 py-1.5 text-xs font-medium text-gray-800">
          Dark
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-gray-100/20 bg-gray-100/10 px-3 py-1.5 text-xs font-medium text-gray-100">
          Light
        </span>
      </div>
    </ComponentContainerCard>
  );
};

const Badges = () => {
  return (
    <div id="badges" className="scroll-mt-40">
      <h4 className="mb-4 text-xl text-default-900">Badges</h4>
      <div className="space-y-4">
        <DefaultBadges />
        <RoundedBadges />
        <OutlineBadges />
        <OutlineRoundedBadges />
        <SoftBadges />
        <SoftRoundedBadges />
      </div>
    </div>
  );
};

export default Badges;
