"use client"

import { createContext, useContext, useState, useMemo, useCallback } from "react"
import { deleteCookie, hasCookie, getCookie, setCookie } from "cookies-next"

const AuthContext = createContext(undefined)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

const authSessionKey = "__GESTIO-MAIRIE_REACT_AUTH__"
const authSessionKeyToken = "__GESTIO-MAIRIE_REACT_AUTH__TOKEN"
const authSessionKeyUser = "__GESTIO-MAIRIE_REACT_AUTH__USER"
const authSessionKeyAvatar = "__GESTIO-MAIRIE_REACT_AVATAR";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const tokenFromCookie = getCookie(authSessionKeyToken)
    return tokenFromCookie ? JSON.parse(tokenFromCookie) : undefined
  })

  const [profileImage, setProfileImage] = useState(() => {
    const profilImageFromCookie = getCookie(authSessionKeyAvatar);
    return profilImageFromCookie ? JSON.parse(profilImageFromCookie) : undefined;
  });

  const [user, setUser] = useState(() => {
    const userFromCookie = getCookie(authSessionKeyUser)
    return userFromCookie ? JSON.parse(userFromCookie) : undefined
  })


  const saveSession = useCallback((data) => {
    console.log('session', data);
    setCookie(authSessionKey, "true");
    setCookie(authSessionKeyToken, JSON.stringify(data.token));
    setCookie(authSessionKeyUser, JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  }, []);

  const saveUser = useCallback((user) => {
    setUser(prevSession => ({
      ...prevSession,
      ...user
    }));
  }, []);

  const saveProfilImage = useCallback((image) => {
    setProfileImage(image);
    setCookie(authSessionKeyAvatar, JSON.stringify(image));
    setUser(prevSession => ({
      ...prevSession,
      avatar: image
    }));
  }, []);


  const removeSession = useCallback(() => {
    deleteCookie(authSessionKey)
    deleteCookie(authSessionKeyToken)
    deleteCookie(authSessionKeyUser)

    setToken(undefined)
    setUser(undefined)
  }, [])

  const logout = useCallback(() => {
    removeSession()
    localStorage.removeItem("user")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("token")
  }, [removeSession])

  const getToken = useCallback(() => token, [token])

  const isAuthenticated = useMemo(() => {
    return !!token && !!user;
  }, [token, user]);


  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          token,
          user,
          logout,
          getToken,
          saveSession,
          removeSession,
          saveProfilImage,
          saveUser,
          isAuthenticated,
        }),
        [token, user, logout, getToken, saveSession],
      )}
    >
      {children}
    </AuthContext.Provider>
  )
}

