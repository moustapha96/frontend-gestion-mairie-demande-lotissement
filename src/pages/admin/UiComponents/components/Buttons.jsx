import { ComponentContainerCard } from "@/components";
import {
  LuCodesandbox,
  LuDribbble,
  LuFacebook,
  LuGithub,
  LuInstagram,
  LuLinkedin,
} from "react-icons/lu";
import { Link } from "react-router-dom";

const DefaultButtons = () => {
  return (
    <ComponentContainerCard title="Default Buttons">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to=""
          className="inline-block rounded-md bg-primary px-6 py-2 text-center text-base text-white transition-all hover:bg-primary-700"
        >
          Primary
        </Link>
        <Link
          to=""
          className="inline-block rounded-md bg-gray-500 px-6 py-2 text-center text-base text-white transition-all hover:bg-gray-600"
        >
          Gray
        </Link>
        <Link
          to=""
          className="inline-block rounded-md bg-emerald-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-emerald-700"
        >
          Emerald
        </Link>
        <Link
          to=""
          className="inline-block rounded-md bg-red-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-red-700"
        >
          Red
        </Link>
        <Link
          to=""
          className="inline-block rounded-md bg-blue-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-blue-700"
        >
          Blue
        </Link>
        <Link
          to=""
          className="inline-block rounded-md bg-yellow-500 px-6 py-2 text-center text-base text-white transition-all hover:bg-yellow-600"
        >
          Yellow
        </Link>
        <Link
          to=""
          className="inline-block rounded-md bg-sky-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-sky-700"
        >
          Sky
        </Link>
        <Link
          to=""
          className="inline-block rounded-md bg-cyan-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-cyan-700"
        >
          Cyan
        </Link>
        <Link
          to=""
          className="inline-block rounded-md bg-indigo-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-indigo-700"
        >
          Indigo
        </Link>
        <Link
          to=""
          className="inline-block rounded-md bg-purple-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-purple-700"
        >
          Purple
        </Link>
        <Link
          to=""
          className="inline-block rounded-md bg-gray-700 px-6 py-2 text-center text-base text-white transition-all hover:bg-gray-800"
        >
          Dark
        </Link>
        <Link
          to=""
          className="inline-block rounded-md bg-gray-100 px-6 py-2 text-center text-base text-gray-900 transition-all hover:bg-gray-200"
        >
          Light
        </Link>
      </div>
    </ComponentContainerCard>
  );
};

const RoundedButtons = () => {
  return (
    <ComponentContainerCard title="Rounded Buttons">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to=""
          className="inline-block rounded-full bg-primary px-6 py-2 text-center text-base text-white transition-all hover:bg-primary-700"
        >
          Primary
        </Link>
        <Link
          to=""
          className="inline-block rounded-full bg-gray-500 px-6 py-2 text-center text-base text-white transition-all hover:bg-gray-600"
        >
          Gray
        </Link>
        <Link
          to=""
          className="inline-block rounded-full bg-emerald-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-emerald-700"
        >
          Emerald
        </Link>
        <Link
          to=""
          className="inline-block rounded-full bg-red-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-red-700"
        >
          Red
        </Link>
        <Link
          to=""
          className="inline-block rounded-full bg-blue-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-blue-700"
        >
          Blue
        </Link>
        <Link
          to=""
          className="inline-block rounded-full bg-yellow-500 px-6 py-2 text-center text-base text-white transition-all hover:bg-yellow-600"
        >
          Yellow
        </Link>
        <Link
          to=""
          className="inline-block rounded-full bg-sky-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-sky-700"
        >
          Sky
        </Link>
        <Link
          to=""
          className="inline-block rounded-full bg-cyan-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-cyan-700"
        >
          Cyan
        </Link>
        <Link
          to=""
          className="inline-block rounded-full bg-indigo-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-indigo-700"
        >
          Indigo
        </Link>
        <Link
          to=""
          className="inline-block rounded-full bg-purple-600 px-6 py-2 text-center text-base text-white transition-all hover:bg-purple-700"
        >
          Purple
        </Link>
        <Link
          to=""
          className="inline-block rounded-full bg-gray-700 px-6 py-2 text-center text-base text-white transition-all hover:bg-gray-800"
        >
          Dark
        </Link>
        <Link
          to=""
          className="inline-block rounded-full bg-gray-100 px-6 py-2 text-center text-base text-gray-900 transition-all hover:bg-gray-200"
        >
          Light
        </Link>
      </div>
    </ComponentContainerCard>
  );
};

const OutlineButtons = () => {
  return (
    <ComponentContainerCard title="Outline Buttons">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to=""
          className="inline-block rounded-md border border-primary px-6 py-2 text-center text-base text-primary transition-all hover:bg-primary hover:text-white"
        >
          Primary
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-gray-500 px-6 py-2 text-center text-base text-gray-500 transition-all hover:bg-gray-500 hover:text-white"
        >
          Gray
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-emerald-600 px-6 py-2 text-center text-base text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white"
        >
          Emerald
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-red-600 px-6 py-2 text-center text-base text-red-600 transition-all hover:bg-red-600 hover:text-white"
        >
          Red
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-blue-600 px-6 py-2 text-center text-base text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
        >
          Blue
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-yellow-500 px-6 py-2 text-center text-base text-yellow-500 transition-all hover:bg-yellow-500 hover:text-white"
        >
          Yellow
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-sky-600 px-6 py-2 text-center text-base text-sky-600 transition-all hover:bg-sky-600 hover:text-white"
        >
          Sky
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-cyan-600 px-6 py-2 text-center text-base text-cyan-600 transition-all hover:bg-cyan-600 hover:text-white"
        >
          Cyan
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-indigo-600 px-6 py-2 text-center text-base text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white"
        >
          Indigo
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-purple-600 px-6 py-2 text-center text-base text-purple-600 transition-all hover:bg-purple-600 hover:text-white"
        >
          Purple
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-gray-700 px-6 py-2 text-center text-base text-gray-700 transition-all hover:bg-gray-700 hover:text-white"
        >
          Dark
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-gray-100 px-6 py-2 text-center text-base text-gray-100 transition-all hover:bg-gray-100 hover:text-gray-900"
        >
          Light
        </Link>
      </div>
    </ComponentContainerCard>
  );
};

const OutlineRoundedButtons = () => {
  return (
    <ComponentContainerCard title="Outline Rounded Buttons">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to=""
          className="inline-block rounded-full border border-primary px-6 py-2 text-center text-base text-primary transition-all hover:bg-primary hover:text-white"
        >
          Primary
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-gray-500 px-6 py-2 text-center text-base text-gray-500 transition-all hover:bg-gray-500 hover:text-white"
        >
          Gray
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-emerald-600 px-6 py-2 text-center text-base text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white"
        >
          Emerald
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-red-600 px-6 py-2 text-center text-base text-red-600 transition-all hover:bg-red-600 hover:text-white"
        >
          Red
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-blue-600 px-6 py-2 text-center text-base text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
        >
          Blue
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-yellow-500 px-6 py-2 text-center text-base text-yellow-500 transition-all hover:bg-yellow-500 hover:text-white"
        >
          Yellow
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-sky-600 px-6 py-2 text-center text-base text-sky-600 transition-all hover:bg-sky-600 hover:text-white"
        >
          Sky
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-cyan-600 px-6 py-2 text-center text-base text-cyan-600 transition-all hover:bg-cyan-600 hover:text-white"
        >
          Cyan
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-indigo-600 px-6 py-2 text-center text-base text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white"
        >
          Indigo
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-purple-600 px-6 py-2 text-center text-base text-purple-600 transition-all hover:bg-purple-600 hover:text-white"
        >
          Purple
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-gray-700 px-6 py-2 text-center text-base text-gray-700 transition-all hover:bg-gray-700 hover:text-white"
        >
          Dark
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-gray-100 px-6 py-2 text-center text-base text-gray-100 transition-all hover:bg-gray-100 hover:text-gray-900"
        >
          Light
        </Link>
      </div>
    </ComponentContainerCard>
  );
};

const SoftButtons = () => {
  return (
    <ComponentContainerCard title="Soft Buttons">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to=""
          className="inline-block rounded-md border border-primary/20 bg-primary/5 px-6 py-2 text-center text-base text-primary transition-all hover:bg-primary hover:text-white"
        >
          Primary
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-gray-500/20 bg-gray-500/5 px-6 py-2 text-center text-base text-gray-500 transition-all hover:bg-gray-500 hover:text-white"
        >
          Gray
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-emerald-600/20 bg-emerald-600/5 px-6 py-2 text-center text-base text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white"
        >
          Emerald
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-red-600/20 bg-red-600/5 px-6 py-2 text-center text-base text-red-600 transition-all hover:bg-red-600 hover:text-white"
        >
          Red
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-blue-600/20 bg-blue-600/5 px-6 py-2 text-center text-base text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
        >
          Blue
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-yellow-500/20 bg-yellow-500/5 px-6 py-2 text-center text-base text-yellow-500 transition-all hover:bg-yellow-500 hover:text-white"
        >
          Yellow
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-sky-600/20 bg-sky-600/5 px-6 py-2 text-center text-base text-sky-600 transition-all hover:bg-sky-600 hover:text-white"
        >
          Sky
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-cyan-600/20 bg-cyan-600/5 px-6 py-2 text-center text-base text-cyan-600 transition-all hover:bg-cyan-600 hover:text-white"
        >
          Cyan
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-indigo-600/20 bg-indigo-600/5 px-6 py-2 text-center text-base text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white"
        >
          Indigo
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-purple-600/20 bg-purple-600/5 px-6 py-2 text-center text-base text-purple-600 transition-all hover:bg-purple-600 hover:text-white"
        >
          Purple
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-gray-700/20 bg-gray-700/5 px-6 py-2 text-center text-base text-gray-700 transition-all hover:bg-gray-700 hover:text-white"
        >
          Dark
        </Link>
        <Link
          to=""
          className="inline-block rounded-md border border-gray-100/20 bg-gray-100/5 px-6 py-2 text-center text-base text-gray-100 transition-all hover:bg-gray-100 hover:text-gray-900"
        >
          Light
        </Link>
      </div>
    </ComponentContainerCard>
  );
};

const SoftRoundedButtons = () => {
  return (
    <ComponentContainerCard title="Soft Rounded Buttons">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to=""
          className="inline-block rounded-full border border-primary/20 bg-primary/5 px-6 py-2 text-center text-base text-primary transition-all hover:bg-primary hover:text-white"
        >
          Primary
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-gray-500/20 bg-gray-500/5 px-6 py-2 text-center text-base text-gray-500 transition-all hover:bg-gray-500 hover:text-white"
        >
          Gray
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-emerald-600/20 bg-emerald-600/5 px-6 py-2 text-center text-base text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white"
        >
          Emerald
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-red-600/20 bg-red-600/5 px-6 py-2 text-center text-base text-red-600 transition-all hover:bg-red-600 hover:text-white"
        >
          Red
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-blue-600/20 bg-blue-600/5 px-6 py-2 text-center text-base text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
        >
          Blue
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-yellow-500/20 bg-yellow-500/5 px-6 py-2 text-center text-base text-yellow-500 transition-all hover:bg-yellow-500 hover:text-white"
        >
          Yellow
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-sky-600/20 bg-sky-600/5 px-6 py-2 text-center text-base text-sky-600 transition-all hover:bg-sky-600 hover:text-white"
        >
          Sky
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-cyan-600/20 bg-cyan-600/5 px-6 py-2 text-center text-base text-cyan-600 transition-all hover:bg-cyan-600 hover:text-white"
        >
          Cyan
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-indigo-600/20 bg-indigo-600/5 px-6 py-2 text-center text-base text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white"
        >
          Indigo
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-purple-600/20 bg-purple-600/5 px-6 py-2 text-center text-base text-purple-600 transition-all hover:bg-purple-600 hover:text-white"
        >
          Purple
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-gray-700/20 bg-gray-700/5 px-6 py-2 text-center text-base text-gray-700 transition-all hover:bg-gray-700 hover:text-white"
        >
          Dark
        </Link>
        <Link
          to=""
          className="inline-block rounded-full border border-gray-100/20 bg-gray-100/5 px-6 py-2 text-center text-base text-gray-100 transition-all hover:bg-gray-100 hover:text-gray-900"
        >
          Light
        </Link>
      </div>
    </ComponentContainerCard>
  );
};

const GhostButtons = () => {
  return (
    <ComponentContainerCard title="Ghost Buttons">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to=""
          className="inline-block rounded-md px-6 py-2 text-center text-base text-primary-500 transition-all hover:bg-primary/20"
        >
          Primary
        </Link>
        <Link
          to=""
          className="inline-block rounded-md px-6 py-2 text-center text-base text-gray-500 transition-all hover:bg-gray-500/20"
        >
          Gray
        </Link>
        <Link
          to=""
          className="inline-block rounded-md px-6 py-2 text-center text-base text-emerald-600 transition-all hover:bg-emerald-500/20"
        >
          Emerald
        </Link>
        <Link
          to=""
          className="inline-block rounded-md px-6 py-2 text-center text-base text-red-600 transition-all hover:bg-red-500/20"
        >
          Red
        </Link>
        <Link
          to=""
          className="inline-block rounded-md px-6 py-2 text-center text-base text-blue-600 transition-all hover:bg-blue-500/20"
        >
          Blue
        </Link>
        <Link
          to=""
          className="inline-block rounded-md px-6 py-2 text-center text-base text-yellow-500 transition-all hover:bg-yellow-500/20"
        >
          Yellow
        </Link>
        <Link
          to=""
          className="inline-block rounded-md px-6 py-2 text-center text-base text-sky-600 transition-all hover:bg-sky-500/20"
        >
          Sky
        </Link>
        <Link
          to=""
          className="inline-block rounded-md px-6 py-2 text-center text-base text-cyan-600 transition-all hover:bg-cyan-500/20"
        >
          Cyan
        </Link>
        <Link
          to=""
          className="inline-block rounded-md px-6 py-2 text-center text-base text-indigo-600 transition-all hover:bg-indigo-500/20"
        >
          Indigo
        </Link>
        <Link
          to=""
          className="inline-block rounded-md px-6 py-2 text-center text-base text-purple-600 transition-all hover:bg-purple-500/20"
        >
          Purple
        </Link>
        <Link
          to=""
          className="inline-block rounded-md px-6 py-2 text-center text-base text-gray-700 transition-all hover:bg-gray-700/20"
        >
          Dark
        </Link>
        <Link
          to=""
          className="inline-block rounded-md px-6 py-2 text-center text-base text-gray-100 transition-all hover:bg-gray-200/20"
        >
          Light
        </Link>
      </div>
    </ComponentContainerCard>
  );
};

const GhostRoundedButtons = () => {
  return (
    <ComponentContainerCard title="Ghost Rounded Buttons">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to=""
          className="inline-block rounded-full px-6 py-2 text-center text-base text-primary-500 transition-all hover:bg-primary/20"
        >
          Primary
        </Link>
        <Link
          to=""
          className="inline-block rounded-full px-6 py-2 text-center text-base text-gray-500 transition-all hover:bg-gray-500/20"
        >
          Gray
        </Link>
        <Link
          to=""
          className="inline-block rounded-full px-6 py-2 text-center text-base text-emerald-600 transition-all hover:bg-emerald-500/20"
        >
          Emerald
        </Link>
        <Link
          to=""
          className="inline-block rounded-full px-6 py-2 text-center text-base text-red-600 transition-all hover:bg-red-500/20"
        >
          Red
        </Link>
        <Link
          to=""
          className="inline-block rounded-full px-6 py-2 text-center text-base text-blue-600 transition-all hover:bg-blue-500/20"
        >
          Blue
        </Link>
        <Link
          to=""
          className="inline-block rounded-full px-6 py-2 text-center text-base text-yellow-500 transition-all hover:bg-yellow-500/20"
        >
          Yellow
        </Link>
        <Link
          to=""
          className="inline-block rounded-full px-6 py-2 text-center text-base text-sky-600 transition-all hover:bg-sky-500/20"
        >
          Sky
        </Link>
        <Link
          to=""
          className="inline-block rounded-full px-6 py-2 text-center text-base text-cyan-600 transition-all hover:bg-cyan-500/20"
        >
          Cyan
        </Link>
        <Link
          to=""
          className="inline-block rounded-full px-6 py-2 text-center text-base text-indigo-600 transition-all hover:bg-indigo-500/20"
        >
          Indigo
        </Link>
        <Link
          to=""
          className="inline-block rounded-full px-6 py-2 text-center text-base text-purple-600 transition-all hover:bg-purple-500/20"
        >
          Purple
        </Link>
        <Link
          to=""
          className="inline-block rounded-full px-6 py-2 text-center text-base text-gray-700 transition-all hover:bg-gray-700/20"
        >
          Dark
        </Link>
        <Link
          to=""
          className="inline-block rounded-full px-6 py-2 text-center text-base text-gray-100 transition-all hover:bg-gray-200/20"
        >
          Light
        </Link>
      </div>
    </ComponentContainerCard>
  );
};

const ButtonSizes = () => {
  return (
    <ComponentContainerCard title="Button Size">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to=""
          className="inline-block rounded bg-primary px-4 py-1 text-center text-sm text-white transition-all hover:bg-primary-700"
        >
          Small
        </Link>
        <Link
          to=""
          className="inline-block rounded-md bg-primary px-6 py-2 text-center text-base text-white transition-all hover:bg-primary-700"
        >
          Default
        </Link>
        <Link
          to=""
          className="inline-block rounded-lg bg-primary px-8 py-2.5 text-center text-lg text-white transition-all hover:bg-primary-700"
        >
          Large
        </Link>
      </div>
    </ComponentContainerCard>
  );
};

const IconButtons = () => {
  return (
    <ComponentContainerCard title="Button Icons">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to=""
          className="inline-flex size-10 items-center justify-center rounded-md bg-blue-500 text-white transition-all hover:bg-blue-600"
        >
          <LuFacebook className="size-5" />
        </Link>
        <Link
          to=""
          className="inline-flex size-10 items-center justify-center rounded-full bg-pink-500 text-white transition-all hover:bg-pink-600"
        >
          <LuInstagram className="size-5" />
        </Link>
        <Link
          to=""
          className="inline-flex size-10 items-center justify-center rounded-md border border-blue-700 text-blue-700 transition-all hover:bg-blue-700 hover:text-white"
        >
          <LuLinkedin className="size-5" />
        </Link>
        <Link
          to=""
          className="inline-flex size-10 items-center justify-center rounded-full border border-pink-500 text-pink-500 transition-all hover:bg-pink-500 hover:text-white"
        >
          <LuDribbble className="size-5" />
        </Link>
        <Link
          to=""
          className="inline-flex size-10 items-center justify-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 transition-all hover:bg-emerald-600 hover:text-white"
        >
          <LuCodesandbox className="size-5" />
        </Link>
        <Link
          to=""
          className="inline-flex size-10 items-center justify-center rounded-full border border-gray-800/40 bg-gray-800/10 text-gray-800 transition-all hover:bg-gray-800 hover:text-white"
        >
          <LuGithub className="size-5" />
        </Link>
      </div>
    </ComponentContainerCard>
  );
};

const Buttons = () => {
  return (
    <div id="buttons" className="scroll-mt-40">
      <h4 className="mb-4 text-xl text-default-900">Buttons</h4>
      <div className="space-y-4">
        <DefaultButtons />
        <RoundedButtons />
        <OutlineButtons />
        <OutlineRoundedButtons />
        <SoftButtons />
        <SoftRoundedButtons />
        <GhostButtons />
        <GhostRoundedButtons />
        <ButtonSizes />
        <IconButtons />
      </div>
    </div>
  );
};

export default Buttons;
