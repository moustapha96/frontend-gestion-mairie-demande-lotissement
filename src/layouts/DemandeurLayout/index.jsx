import { Suspense, lazy, useEffect } from "react";
const TopBar = lazy(() => import("./components/TopBar"));
const Footer = lazy(() => import("./components/Footer"));

const DemandeurLayout = ({ children }) => {
  useEffect(() => {
    document.body.classList.add("bg-default-50");
    return () => {
      document.body.classList.remove("bg-default-50");
    };
  }, []);
  return (
    <>
      <Suspense fallback={<div />}>
        <TopBar />
      </Suspense>

      <Suspense fallback={<div />}>{children}</Suspense>

      <Suspense fallback={<div />}>
        <Footer />
      </Suspense>
    </>
  );
};

export default DemandeurLayout;
