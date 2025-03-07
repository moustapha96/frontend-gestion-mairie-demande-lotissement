import { ComponentContainerCard } from "@/components";
import {
  LuChevronDown,
  LuCog,
  LuLogOut,
  LuMic,
  LuMoreVertical,
  LuUserCircle,
} from "react-icons/lu";
import { Link } from "react-router-dom";

import avatar1 from "@/assets/images/avatars/img-1.jpg";

const DefaultDropDowns = () => {
  const DropdownMenu = () => {
    return (
      <div className="hs-dropdown-menu z-10 mt-4 hidden min-w-[200px] rounded-lg border border-default-100 bg-white opacity-0 shadow-lg transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:bg-default-50">
        <ul className="flex flex-col gap-1 py-1.5">
          <li className="mx-1.5">
            <Link
              className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700"
              to=""
            >
              Action
            </Link>
          </li>
          <li className="mx-1.5">
            <Link
              className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700"
              to=""
            >
              Another Action
            </Link>
          </li>
          <li className="mx-1.5">
            <Link
              className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700"
              to=""
            >
              Menu Item
            </Link>
          </li>
          <hr className="border-default-200" />
          <li className="mx-1.5">
            <Link
              className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700"
              to=""
            >
              Something else here
            </Link>
          </li>
        </ul>
      </div>
    );
  };
  return (
    <ComponentContainerCard title="Default Dropdowns">
      <div className="flex flex-wrap gap-2">
        <div className="hs-dropdown">
          <button className="hs-dropdown-toggle inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-center text-base text-white transition-all duration-500 hover:bg-primary-700">
            Primary
            <LuChevronDown className="size-4" />
          </button>
          <DropdownMenu />
        </div>
        <div className="hs-dropdown">
          <button className="hs-dropdown-toggle inline-flex items-center gap-2 rounded-md bg-gray-500 px-6 py-2 text-center text-base text-white transition-all duration-500 hover:bg-gray-600">
            Gray
            <LuChevronDown className="size-4" />
          </button>
          <DropdownMenu />
        </div>
        <div className="hs-dropdown">
          <button className="hs-dropdown-toggle inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-center text-base text-white transition-all duration-500 hover:bg-emerald-700">
            Emerald
            <LuChevronDown className="size-4" />
          </button>
          <DropdownMenu />
        </div>
        <div className="hs-dropdown">
          <button className="hs-dropdown-toggle inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-2 text-center text-base text-white transition-all duration-500 hover:bg-red-700">
            Red
            <LuChevronDown className="size-4" />
          </button>
          <DropdownMenu />
        </div>
        <div className="hs-dropdown">
          <button className="hs-dropdown-toggle inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-center text-base text-white transition-all duration-500 hover:bg-blue-700">
            Blue
            <LuChevronDown className="size-4" />
          </button>
          <DropdownMenu />
        </div>
        <div className="hs-dropdown">
          <button className="hs-dropdown-toggle inline-flex items-center gap-2 rounded-md bg-yellow-500 px-6 py-2 text-center text-base text-white transition-all duration-500 hover:bg-yellow-600">
            Yellow
            <LuChevronDown className="size-4" />
          </button>
          <DropdownMenu />
        </div>
        <div className="hs-dropdown">
          <button className="hs-dropdown-toggle inline-flex items-center gap-2 rounded-md bg-sky-600 px-6 py-2 text-center text-base text-white transition-all duration-500 hover:bg-sky-700">
            Sky
            <LuChevronDown className="size-4" />
          </button>
          <DropdownMenu />
        </div>
        <div className="hs-dropdown">
          <button className="hs-dropdown-toggle inline-flex items-center gap-2 rounded-md bg-cyan-600 px-6 py-2 text-center text-base text-white transition-all duration-500 hover:bg-cyan-700">
            Cyan
            <LuChevronDown className="size-4" />
          </button>
          <DropdownMenu />
        </div>
        <div className="hs-dropdown">
          <button className="hs-dropdown-toggle inline-flex items-center gap-2 rounded-md bg-gray-800 px-6 py-2 text-center text-base text-white transition-all duration-500 hover:bg-gray-900">
            Dark
            <LuChevronDown className="size-4" />
          </button>
          <DropdownMenu />
        </div>
        <div className="hs-dropdown">
          <button className="hs-dropdown-toggle inline-flex items-center gap-2 rounded-md bg-gray-100 px-6 py-2 text-center text-base text-gray-900 transition-all duration-500 hover:bg-gray-200">
            Light
            <LuChevronDown className="size-4" />
          </button>
          <DropdownMenu />
        </div>
      </div>
    </ComponentContainerCard>
  );
};

const DropdownVariants = () => {
  return (
    <ComponentContainerCard title="Dropdowns Variants">
      <div className="flex flex-wrap gap-2">
        <div className="hs-dropdown [--auto-close:inside]">
          <button
            type="button"
            className="hs-dropdown-toggle inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-center text-base text-white transition-all duration-500 hover:bg-primary-700"
          >
            Radio
            <LuChevronDown className="ms-1 size-4" />
          </button>
          <div className="hs-dropdown-menu z-10 mt-4 hidden min-w-[200px] rounded-lg border border-default-100 bg-white p-1.5 opacity-0 shadow-lg transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:bg-default-50">
            <div className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="default-radio"
                  className="size-4 border-default-200 bg-default-50 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary/60 focus:ring-offset-0"
                  id="default-radio"
                />
                <label
                  htmlFor="default-radio"
                  className="ms-2 text-sm text-default-700"
                >
                  Default radio
                </label>
              </div>
            </div>
            <div className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="default-radio"
                  className="size-4 border-default-200 bg-default-50 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary/60 focus:ring-offset-0"
                  id="checked-radio"
                  defaultChecked
                />
                <label
                  htmlFor="checked-radio"
                  className="ms-2 text-sm text-default-700"
                >
                  Checked radio
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="hs-dropdown [--auto-close:inside]">
          <button
            type="button"
            className="hs-dropdown-toggle inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-center text-base text-white transition-all duration-500 hover:bg-primary-700"
          >
            CheckBox
            <LuChevronDown className="ms-1 size-4" />
          </button>
          <div className="hs-dropdown-menu z-10 mt-4 hidden min-w-[200px] rounded-lg border border-default-100 bg-white p-1.5 opacity-0 shadow-lg transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:bg-default-50">
            <div className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="size-4 rounded border-default-200 bg-default-50 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary/60 focus:ring-offset-0"
                  id="default-checkbox"
                />
                <label
                  htmlFor="default-checkbox"
                  className="ms-2 text-sm text-default-700"
                >
                  Default checkbox
                </label>
              </div>
            </div>
            <div className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="size-4 rounded border-default-200 bg-default-50 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary/60 focus:ring-offset-0"
                  id="checked-checkbox"
                  defaultChecked
                />
                <label
                  htmlFor="checked-checkbox"
                  className="ms-2 text-sm text-default-700"
                >
                  Checked checkbox
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="hs-dropdown [--auto-close:inside]">
          <button
            type="button"
            className="hs-dropdown-toggle inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-center text-base text-white transition-all duration-500 hover:bg-primary-700"
          >
            Form
            <LuChevronDown className="ms-1 size-4" />
          </button>
          <div className="hs-dropdown-menu z-10 mt-4 hidden min-w-[200px] rounded-lg border border-default-100 bg-white p-4 opacity-0 shadow-lg transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:bg-default-50">
            <form>
              <div className="mb-3 space-y-1">
                <label
                  htmlFor="exampleInputEmail1"
                  className="font-medium text-default-800"
                >
                  Email address
                </label>
                <input
                  type="email"
                  className="text-defa-900 block w-full rounded border-default-200 bg-transparent px-3 py-1.5 focus:border-default-200 focus:ring-transparent"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                />
                <span className="inline-block">
                  <small
                    id="emailHelp"
                    className="form-text text-sm text-default-700"
                  >
                    We'll never share your email with anyone else.
                  </small>
                </span>
              </div>
              <div className="mb-3 space-y-1">
                <label
                  htmlFor="exampleInputPassword1"
                  className="font-medium text-default-800"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="text-defa-900 block w-full rounded border-default-200 bg-transparent px-3 py-1.5 focus:border-default-200 focus:ring-transparent"
                  id="exampleInputPassword1"
                  placeholder="Password"
                />
              </div>
              <div className="mb-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  className="size-4 rounded border-default-200 bg-default-50 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary/60 focus:ring-offset-0"
                  id="checkmeout0"
                />
                <label
                  className="inline-block text-sm font-medium text-default-700"
                  htmlFor="checkmeout0"
                >
                  Check me out !
                </label>
              </div>
              <button
                type="submit"
                className="inline-block rounded bg-primary px-4 py-2 text-center text-sm text-white transition-all duration-500 hover:bg-primary-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
        <div className="hs-dropdown">
          <button className="hs-dropdown-toggle hs-dropdown-toggle inline-flex items-center gap-2 rounded-full border border-default-200 py-1 pe-2 ps-1 text-center text-base text-default-900 transition-all duration-500 hover:border-primary/40 hover:bg-primary/5 hover:text-primary">
            <span className="inline-flex size-9 items-center overflow-hidden rounded-full">
              <img src={avatar1} className="h-full max-w-full" />
            </span>
            Jesica
            <LuChevronDown className="size-4" />
          </button>
          <div className="hs-dropdown-menu z-10 mt-4 hidden min-w-[200px] rounded-lg border border-default-100 bg-white opacity-0 shadow-lg transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:bg-default-50">
            <ul className="flex flex-col gap-1 py-1.5">
              <li className="mx-1.5">
                <Link
                  className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700"
                  to=""
                >
                  <LuUserCircle className="me-2 size-4" />
                  Profile
                </Link>
              </li>
              <li className="mx-1.5">
                <Link
                  className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700"
                  to=""
                >
                  <LuCog className="me-2 size-4" />
                  Settings
                </Link>
              </li>
              <li className="mx-1.5">
                <Link
                  className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700"
                  to=""
                >
                  <LuMic className="me-2 size-4" />
                  Support
                </Link>
              </li>
              <hr className="border-default-200" />
              <li className="mx-1.5">
                <Link
                  className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-red-500/20 hover:text-red-500"
                  to=""
                >
                  <LuLogOut className="me-2 size-4" />
                  Log Out
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="hs-dropdown">
          <button className="hs-dropdown-toggle inline-flex size-10 items-center justify-center rounded-md bg-primary text-white transition-all duration-500 hover:bg-primary-700">
            <LuMoreVertical className="size-4" />
          </button>
          <div className="hs-dropdown-menu z-10 mt-4 hidden min-w-[200px] rounded-lg border border-default-100 bg-white opacity-0 shadow-lg transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:bg-default-50">
            <ul className="flex flex-col gap-1 py-1.5">
              <li className="mx-1.5">
                <Link
                  className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700"
                  to=""
                >
                  Action
                </Link>
              </li>
              <li className="mx-1.5">
                <Link
                  className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700"
                  to=""
                >
                  Another Action
                </Link>
              </li>
              <li className="mx-1.5">
                <Link
                  className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700"
                  to=""
                >
                  Menu Item
                </Link>
              </li>
              <hr className="border-default-200" />
              <li className="mx-1.5">
                <Link
                  className="flex items-center rounded px-3 py-2 text-default-600 transition-all hover:bg-default-100 hover:text-default-700"
                  to=""
                >
                  Something else here
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ComponentContainerCard>
  );
};

const Dropdowns = () => {
  return (
    <div id="dropdowns" className="scroll-mt-40">
      <h4 className="mb-4 text-xl text-default-900">Dropdowns</h4>
      <div className="space-y-4">
        <DefaultDropDowns />
        <DropdownVariants />
      </div>
    </div>
  );
};

export default Dropdowns;
