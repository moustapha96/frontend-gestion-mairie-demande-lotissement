import { Suspense } from "react";
import { Preloader } from "@/components";

const DefaultLayout = ({ children }) => {
  return <Suspense fallback={<Preloader />}>{children}</Suspense>;
};

export default DefaultLayout;
