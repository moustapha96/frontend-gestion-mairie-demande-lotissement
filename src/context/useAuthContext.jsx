// "use client";

// import {
//   createContext, useContext, useState, useMemo,
//   useCallback, useEffect
// } from "react";
// import { deleteCookie, getCookie, setCookie } from "cookies-next";

// const AuthContext = createContext(undefined);

// export function useAuthContext() {
//   const ctx = useContext(AuthContext);
//   if (ctx === undefined) {
//     throw new Error("useAuthContext must be used within an AuthProvider");
//   }
//   return ctx;
// }

// /* ========= Storage Keys ========= */
// const KEY_AUTH_FLAG = "__GESTIO-MAIRIE_REACT_AUTH__";
// const KEY_ACCESS    = "__GESTIO-MAIRIE_REACT_AUTH__TOKEN";
// const KEY_REFRESH   = "__GESTIO-MAIRIE_REACT_AUTH__REFRESH";
// const KEY_USER      = "__GESTIO-MAIRIE_REACT_AUTH__USER";
// const KEY_AVATAR    = "__GESTIO-MAIRIE_REACT_AVATAR";

// function safeParseCookie(key) {
//   try {
//     const v = getCookie(key);
//     return v ? JSON.parse(v) : undefined;
//   } catch { return undefined; }
// }

// function safeParseLS(key) {
//   try {
//     const v = localStorage.getItem(key);
//     return v ? JSON.parse(v) : undefined;
//   } catch { return undefined; }
// }

// export function AuthProvider({ children }) {
//   /* ========= State ========= */
//   const [accessToken, setAccessToken] = useState(() => safeParseLS(KEY_ACCESS) ?? safeParseCookie(KEY_ACCESS));
//   const [refreshToken, setRefreshToken] = useState(() => safeParseLS(KEY_REFRESH) ?? safeParseCookie(KEY_REFRESH));
//   const [user, setUser] = useState(() => safeParseLS(KEY_USER) ?? safeParseCookie(KEY_USER));
//   const [profileImage, setProfileImage] = useState(() => safeParseLS(KEY_AVATAR));

//   /* ========= Sync vers stockage ========= */
//   useEffect(() => {
//     if (accessToken) {
//       localStorage.setItem(KEY_ACCESS, JSON.stringify(accessToken));
//       setCookie(KEY_ACCESS, JSON.stringify(accessToken));
//     }
//   }, [accessToken]);

//   useEffect(() => {
//     if (refreshToken) {
//       localStorage.setItem(KEY_REFRESH, JSON.stringify(refreshToken));
//       setCookie(KEY_REFRESH, JSON.stringify(refreshToken));
//     }
//   }, [refreshToken]);

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem(KEY_USER, JSON.stringify(user));
//       localStorage.setItem("isAuthenticated", "true");
//       setCookie(KEY_USER, JSON.stringify(user));
//       setCookie(KEY_AUTH_FLAG, "true");
//     }
//   }, [user]);

//   /* ========= API publique ========= */
//   const saveSession = useCallback(({ token, refresh_token, user: u }) => {
//     if (!token || !u) return;

//     // stockage
//     localStorage.setItem(KEY_AUTH_FLAG, "true");
//     localStorage.setItem(KEY_ACCESS, JSON.stringify(token));
//     if (refresh_token) localStorage.setItem(KEY_REFRESH, JSON.stringify(refresh_token));
//     localStorage.setItem(KEY_USER, JSON.stringify(u));
//     localStorage.setItem("isAuthenticated", "true");

//     // cookies
//     setCookie(KEY_AUTH_FLAG, "true");
//     setCookie(KEY_ACCESS, JSON.stringify(token));
//     if (refresh_token) setCookie(KEY_REFRESH, JSON.stringify(refresh_token));
//     setCookie(KEY_USER, JSON.stringify(u));

//     // state
//     setAccessToken(token);
//     if (refresh_token) setRefreshToken(refresh_token);
//     setUser(u);

//     // propage un event (utile si d'autres parties écoutent)
//     window.dispatchEvent(new CustomEvent("auth:session", {
//       detail: { access: token, refresh: refresh_token }
//     }));
//   }, []);

//   const saveUser = useCallback((userData) => {
//     setUser(prev => {
//       const updated = { ...(prev || {}), ...userData };
//       localStorage.setItem(KEY_USER, JSON.stringify(updated));
//       setCookie(KEY_USER, JSON.stringify(updated));
//       return updated;
//     });
//   }, []);

//   const saveProfilImage = useCallback((image) => {
//     setProfileImage(image);
//     localStorage.setItem(KEY_AVATAR, JSON.stringify(image));
//     setUser(prev => {
//       const updated = { ...(prev || {}), avatar: image };
//       localStorage.setItem(KEY_USER, JSON.stringify(updated));
//       setCookie(KEY_USER, JSON.stringify(updated));
//       return updated;
//     });
//   }, []);

//   const removeSession = useCallback(() => {
//     try { localStorage.clear(); } catch {}
//     [KEY_AUTH_FLAG, KEY_ACCESS, KEY_REFRESH, KEY_USER, KEY_AVATAR, "isAuthenticated"]
//       .forEach(k => { try { localStorage.removeItem(k); } catch {} });
//     [KEY_AUTH_FLAG, KEY_ACCESS, KEY_REFRESH, KEY_USER]
//       .forEach(k => deleteCookie(k));

//     setAccessToken(undefined);
//     setRefreshToken(undefined);
//     setUser(undefined);
//     setProfileImage(undefined);
//   }, []);

//   const logout = useCallback(() => { removeSession(); }, [removeSession]);

//   const getToken = useCallback(() => accessToken, [accessToken]);
//   const isAuthenticated = useMemo(() => Boolean(accessToken && user), [accessToken, user]);

//   /* ========= Refresh au boot si on n’a plus d’access mais un refresh ========= */
//   useEffect(() => {
//     async function attemptRefreshOnBoot() {
//       const access  = safeParseCookie(KEY_ACCESS) ?? safeParseLS(KEY_ACCESS);
//       const refresh = safeParseCookie(KEY_REFRESH) ?? safeParseLS(KEY_REFRESH);

//       if (!access && refresh) {
//         try {
//           const base = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
//           const res = await fetch(`${base}/token/refresh`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json", "Accept": "application/json" },
//             body: JSON.stringify({ refresh_token: refresh })
//           });
//           if (!res.ok) throw new Error("Refresh failed");
//           const data = await res.json();
//           const newAccess  = data.token;
//           const newRefresh = data.refresh_token || refresh;

//           setAccessToken(newAccess);
//           setRefreshToken(newRefresh);
//           localStorage.setItem(KEY_ACCESS, JSON.stringify(newAccess));
//           localStorage.setItem(KEY_REFRESH, JSON.stringify(newRefresh));
//           setCookie(KEY_ACCESS, JSON.stringify(newAccess));
//           setCookie(KEY_REFRESH, JSON.stringify(newRefresh));
//           localStorage.setItem(KEY_AUTH_FLAG, "true");
//           setCookie(KEY_AUTH_FLAG, "true");

//           window.dispatchEvent(new CustomEvent("auth:session", {
//             detail: { access: newAccess, refresh: newRefresh }
//           }));
//         } catch {
//           // On ne redirige pas ici; l’intercepteur Axios gèrera au premier call API
//         }
//       }
//     }
//     attemptRefreshOnBoot();
//   }, []);

//   /* ========= Se resynchroniser si Axios rafraîchit en “arrière-plan” ========= */
//   useEffect(() => {
//     function onSession(e) {
//       const { access, refresh } = e?.detail || {};
//       if (access) setAccessToken(access);
//       if (refresh) setRefreshToken(refresh);
//       // pas de user ici, c’est un refresh transparent
//     }
//     window.addEventListener("auth:session", onSession);
//     return () => window.removeEventListener("auth:session", onSession);
//   }, []);

//   const value = useMemo(() => ({
//     token: accessToken,
//     refreshToken,
//     user,
//     logout,
//     getToken,
//     saveSession,
//     removeSession,
//     saveProfilImage,
//     saveUser,
//     isAuthenticated,
//     profileImage
//   }), [
//     accessToken, refreshToken, user, logout, getToken,
//     saveSession, removeSession, saveProfilImage, saveUser,
//     isAuthenticated, profileImage
//   ]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// src/context/AuthContext.jsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { KEY_ACCESS, KEY_AUTH_FLAG, KEY_USER } from "@/helpers/axiosInstance";


const KEY_AVATAR = "__GESTIO-MAIRIE_REACT_AVATAR";

const AuthContext = createContext(undefined);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}

function safeParseCookie(key) {
  try {
    const v = getCookie(key);
    return v ? JSON.parse(v) : undefined;
  } catch {
    return undefined;
  }
}

function safeParseLS(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : undefined;
  } catch {
    return undefined;
  }
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => safeParseLS(KEY_ACCESS) ?? safeParseCookie(KEY_ACCESS)
  );
  const [user, setUser] = useState(
    () => safeParseLS(KEY_USER) ?? safeParseCookie(KEY_USER)
  );
  const [profileImage, setProfileImage] = useState(
    () => safeParseLS(KEY_AVATAR) ?? undefined
  );

  /* ========= Sync state -> stockage ========= */
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem(KEY_ACCESS, JSON.stringify(accessToken));
      setCookie(KEY_ACCESS, JSON.stringify(accessToken));
    }
  }, [accessToken]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(KEY_USER, JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");
      setCookie(KEY_USER, JSON.stringify(user));
      setCookie(KEY_AUTH_FLAG, "true");
    }
  }, [user]);

  /* ========= API publique ========= */
  const saveSession = useCallback(({ token, user: u }) => {
    if (!token || !u) return;

    // LS + cookies
    localStorage.setItem(KEY_AUTH_FLAG, "true");
    localStorage.setItem(KEY_ACCESS, JSON.stringify(token));
    localStorage.setItem(KEY_USER, JSON.stringify(u));
    localStorage.setItem("isAuthenticated", "true");

    setCookie(KEY_AUTH_FLAG, "true");
    setCookie(KEY_ACCESS, JSON.stringify(token));
    setCookie(KEY_USER, JSON.stringify(u));

    // state
    setAccessToken(token);
    setUser(u);

    window.dispatchEvent(
      new CustomEvent("auth:session", {
        detail: { access: token },
      })
    );
  }, []);

  const saveUser = useCallback((userData) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...userData };
      localStorage.setItem(KEY_USER, JSON.stringify(updated));
      setCookie(KEY_USER, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const saveProfilImage = useCallback((image) => {
    setProfileImage(image);
    localStorage.setItem(KEY_AVATAR, JSON.stringify(image));
    setUser((prev) => {
      const updated = { ...(prev || {}), avatar: image };
      localStorage.setItem(KEY_USER, JSON.stringify(updated));
      setCookie(KEY_USER, JSON.stringify(updated));
      return updated;
    });
  }, []);


  const removeSession = useCallback(() => {
    try {
      localStorage.clear();
    } catch {}
    [
      KEY_AUTH_FLAG,
      KEY_ACCESS,
      KEY_USER,
      KEY_AVATAR,
      "isAuthenticated",
    ].forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
    [KEY_AUTH_FLAG, KEY_ACCESS, KEY_USER].forEach((k) =>
      deleteCookie(k)
    );

    setAccessToken(undefined);
    setUser(undefined);
    setProfileImage(undefined);
  }, []);


  const logout = useCallback(() => {
    removeSession();
    window.location.href = "/auth/login";
  }, [removeSession]);

  const getToken = useCallback(() => accessToken, [accessToken]);
  const isAuthenticated = useMemo(
    () => Boolean(accessToken && user),
    [accessToken, user]
  );

  /* ========= Sync avec HttpClient (auth:session) ========= */
  useEffect(() => {
    function onSession(e) {
      const { access } = e?.detail || {};
      if (access) setAccessToken(access);
    }
    window.addEventListener("auth:session", onSession);
    return () => window.removeEventListener("auth:session", onSession);
  }, []);

  const value = useMemo(
    () => ({
      token: accessToken,
      user,
      logout,
      getToken,
      saveSession,
      removeSession,
      saveProfilImage,
      saveUser,
      isAuthenticated,
      profileImage,
    }),
    [
      accessToken,
      user,
      logout,
      getToken,
      saveSession,
      removeSession,
      saveProfilImage,
      saveUser,
      isAuthenticated,
      profileImage,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
