import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProvider } from "./AppContext";
import './helpers/axiosInstance';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={"/"}>
      <AppProvider >
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
