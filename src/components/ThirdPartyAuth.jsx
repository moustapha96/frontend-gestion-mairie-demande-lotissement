import { Link } from "react-router-dom";

const ThirdPartyAuth = () => {
  return (
    <>
      <div className="my-6 flex shrink items-center">
        <div className="mt-px flex-auto border-t border-dashed border-white/20" />
        <div className="mx-4 text-zinc-100">Or</div>
        <div className="mt-px flex-auto border-t border-dashed border-white/20" />
      </div>
      <div className="mb-6 shrink text-center">
        <p className="mb-6 text-xl text-white">Continue in with</p>
        <ul className="flex flex-wrap items-center justify-center gap-2">
          <li>
            <Link
              to=""
              className="group inline-flex size-12 items-center justify-center rounded-full bg-zinc-900 transition-all duration-300 hover:bg-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="facebook"
                className="lucide lucide-facebook size-5 text-gray-400 group-hover:fill-white/30 group-hover:text-white"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </Link>
          </li>
          <li>
            <Link
              to=""
              className="group inline-flex size-12 items-center justify-center rounded-full bg-zinc-900 transition-all duration-300 hover:bg-pink-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="instagram"
                className="lucide lucide-instagram size-5 text-gray-400 group-hover:fill-white/30 group-hover:text-white"
              >
                <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Link>
          </li>
          <li>
            <Link
              to=""
              className="group inline-flex size-12 items-center justify-center rounded-full bg-zinc-900 transition-all duration-300 hover:bg-sky-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="twitter"
                className="lucide lucide-twitter size-5 text-gray-400 group-hover:fill-white/30 group-hover:text-white"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </Link>
          </li>
          <li>
            <Link
              to=""
              className="group inline-flex size-12 items-center justify-center rounded-full bg-zinc-900 transition-all duration-300 hover:bg-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="linkedin"
                className="lucide lucide-linkedin size-5 text-gray-400 group-hover:fill-white/30 group-hover:text-white"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width={4} height={12} x={2} y={9} />
                <circle cx={4} cy={4} r={2} />
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ThirdPartyAuth;
