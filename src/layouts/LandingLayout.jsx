import { Preloader } from "@/components";
import { Suspense, lazy } from "react";
const Footer = lazy(() => import("@/components/Footer"));

const loading = () => <div />;

const LandingLayout = ({ children }) => {
  return (
    <>
      <Suspense fallback={<Preloader />}>{children}</Suspense>

      <Suspense fallback={loading()}>
        <Footer />
      </Suspense>
    </>
  );
};

export default LandingLayout;
