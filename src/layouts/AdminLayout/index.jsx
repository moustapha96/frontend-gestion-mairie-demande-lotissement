import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "sonner";
const TopBar = lazy(() => import("./components/TopBar"));
const Footer = lazy(() => import("./components/Footer"));

const AdminLayout = ({ children }) => {
  useEffect(() => {
    document.body.classList.add("bg-default-50");
    return () => {
      document.body.classList.remove("bg-default-50");
    };
  }, []);
  return (
    <>
      <Toaster richColors />
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

export default AdminLayout;
