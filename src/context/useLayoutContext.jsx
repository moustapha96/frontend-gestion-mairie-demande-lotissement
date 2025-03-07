import { createContext, useContext, useState, useMemo, useEffect } from "react";

const LayoutContext = createContext(undefined);

function useLayoutContext() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayoutContext must be used within an LayoutProvider");
  }
  return context;
}

function LayoutProvider({ children }) {
  const INIT_STATE = {
    theme: "light",
  };

  const [settings, setSettings] = useState(INIT_STATE);

  const themeMode = settings.theme;

  // update settings
  const updateSettings = (_newSettings) => {
    setSettings({ ...settings, ..._newSettings });
  };

  useEffect(() => {
    const html = document.getElementsByTagName("html")[0];
    if (themeMode === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
  }, [themeMode]);

  const updateTheme = (newTheme) => {
    updateSettings({ ...settings, theme: newTheme });
  };

  const resetSettings = () => {
    setSettings(INIT_STATE);
  };

  return (
    <LayoutContext.Provider
      value={useMemo(
        () => ({
          settings,
          themeMode,
          updateTheme,
          resetSettings,
        }),
        [settings, themeMode]
      )}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export { useLayoutContext, LayoutProvider };
