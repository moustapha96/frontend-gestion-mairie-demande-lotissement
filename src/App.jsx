import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { ScrollToTop } from "./components";
import { AuthProvider, LayoutProvider } from "./context";
import { configureFakeBackend } from "./helpers";
import AllRoutes from "./routes/Routes";

import "preline/preline";
import "@/assets/css/style.css";
import 'leaflet/dist/leaflet.css';


configureFakeBackend();

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      window.HSStaticMethods.autoInit();
    }, 400);
  }, [pathname]);

  return (
    <HelmetProvider>
      <LayoutProvider>
        <AuthProvider>
          <AllRoutes />
          <ScrollToTop />
          <Toaster richColors />
        </AuthProvider>
      </LayoutProvider>
    </HelmetProvider>
  );
}

export default App;
