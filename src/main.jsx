import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProvider } from "./AppContext";
import './helpers/axiosInstance';
import { observeAuthRefresh } from "./boot/observeRefresh";
import { toast } from "sonner";


observeAuthRefresh(({ access, refresh, at }) => {
  console.info("[auth] token refresh", { at, access, refresh });
  // toast.success("Token refresh");
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={"/"}>
      <AppProvider >
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
