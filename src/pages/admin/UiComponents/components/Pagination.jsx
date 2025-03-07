import { ComponentContainerCard } from "@/components";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const SimplePagination = () => {
  return (
    <ComponentContainerCard title="Simple Pagination">
      <nav className="flex items-center gap-x-1">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center gap-x-2 rounded-lg border border-transparent px-2.5 py-2 text-sm text-default-800 hover:bg-default-100 focus:bg-default-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <LuChevronLeft className="size-4" />
        </button>
        <div className="flex items-center gap-x-1">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg border border-default-200 px-3 py-2 text-sm text-default-800 focus:bg-default-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            aria-current="page"
          >
            1
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg border border-transparent px-3 py-2 text-sm text-default-800 hover:bg-default-100 focus:bg-default-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            2
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg border border-transparent px-3 py-2 text-sm text-default-800 hover:bg-default-100 focus:bg-default-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            3
          </button>
        </div>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center gap-x-2 rounded-lg border border-transparent px-2.5 py-2 text-sm text-default-800 hover:bg-default-100 focus:bg-default-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <LuChevronRight className="size-4" />
        </button>
      </nav>
    </ComponentContainerCard>
  );
};

const BorderGroupPagination = () => {
  return (
    <ComponentContainerCard title="Bordered Group Pagination">
      <nav className="flex items-center -space-x-px">
        <button
          type="button"
          className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-1.5 border border-default-200 px-2.5 py-2 text-sm text-default-800 first:rounded-s-lg last:rounded-e-lg hover:bg-default-100 focus:bg-default-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <LuChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          className="flex min-h-[38px] min-w-[38px] items-center justify-center border border-default-200 bg-default-200 px-3 py-2 text-sm text-default-800 first:rounded-s-lg last:rounded-e-lg focus:bg-default-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          aria-current="page"
        >
          1
        </button>
        <button
          type="button"
          className="flex min-h-[38px] min-w-[38px] items-center justify-center border border-default-200 px-3 py-2 text-sm text-default-800 first:rounded-s-lg last:rounded-e-lg hover:bg-default-100 focus:bg-default-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          2
        </button>
        <button
          type="button"
          className="flex min-h-[38px] min-w-[38px] items-center justify-center border border-default-200 px-3 py-2 text-sm text-default-800 first:rounded-s-lg last:rounded-e-lg hover:bg-default-100 focus:bg-default-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          3
        </button>
        <button
          type="button"
          className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-1.5 border border-default-200 px-2.5 py-2 text-sm text-default-800 first:rounded-s-lg last:rounded-e-lg hover:bg-default-100 focus:bg-default-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <LuChevronRight className="size-4" />
        </button>
      </nav>
    </ComponentContainerCard>
  );
};
const Pagination = () => {
  return (
    <div id="pagination" className="scroll-mt-40">
      <h4 className="mb-4 text-xl text-default-900">Pagination</h4>
      <div className="space-y-4">
        <SimplePagination />
        <BorderGroupPagination />
      </div>
    </div>
  );
};

export default Pagination;
