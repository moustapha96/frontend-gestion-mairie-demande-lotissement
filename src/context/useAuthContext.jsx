"use client"

import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react"
import { deleteCookie, getCookie, setCookie } from "cookies-next"

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
const authSessionKeyAvatar = "__GESTIO-MAIRIE_REACT_AVATAR"

export function AuthProvider({ children }) {
  // Initialisation avec priorité au localStorage, puis cookies comme fallback
  const [token, setToken] = useState(() => {
    const tokenFromStorage = localStorage.getItem(authSessionKeyToken)
    const tokenFromCookie = getCookie(authSessionKeyToken)
    return tokenFromStorage ? JSON.parse(tokenFromStorage)
      : tokenFromCookie ? JSON.parse(tokenFromCookie)
        : undefined
  })

  const [user, setUser] = useState(() => {
    const userFromStorage = localStorage.getItem(authSessionKeyUser)
    const userFromCookie = getCookie(authSessionKeyUser)
    return userFromStorage ? JSON.parse(userFromStorage)
      : userFromCookie ? JSON.parse(userFromCookie)
        : undefined
  })

  const [profileImage, setProfileImage] = useState(() => {
    const imageFromStorage = localStorage.getItem(authSessionKeyAvatar)
    return imageFromStorage ? JSON.parse(imageFromStorage) : undefined
  })

  // Synchronisation avec localStorage et cookies
  useEffect(() => {
    if (token) {
      localStorage.setItem(authSessionKeyToken, JSON.stringify(token))
      setCookie(authSessionKeyToken, JSON.stringify(token))
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem(authSessionKeyUser, JSON.stringify(user))
      localStorage.setItem('isAuthenticated', 'true')
      setCookie(authSessionKeyUser, JSON.stringify(user))
      setCookie(authSessionKey, 'true')
    }
  }, [user])

  const saveSession = useCallback((data) => {
    if (!data || !data.token || !data.user) return

    localStorage.setItem(authSessionKey, "true")
    localStorage.setItem(authSessionKeyToken, JSON.stringify(data.token))
    localStorage.setItem(authSessionKeyUser, JSON.stringify(data.user))
    localStorage.setItem('isAuthenticated', 'true')

    setCookie(authSessionKey, "true")
    setCookie(authSessionKeyToken, JSON.stringify(data.token))
    setCookie(authSessionKeyUser, JSON.stringify(data.user))

    setToken(data.token)
    setUser(data.user)
  }, [])

  const saveUser = useCallback((userData) => {
    setUser(prevUser => {
      const updatedUser = { ...prevUser, ...userData }
      localStorage.setItem(authSessionKeyUser, JSON.stringify(updatedUser))
      setCookie(authSessionKeyUser, JSON.stringify(updatedUser))
      return updatedUser
    })
  }, [])

  const saveProfilImage = useCallback((image) => {
    setProfileImage(image)
    localStorage.setItem(authSessionKeyAvatar, JSON.stringify(image))
    setUser(prevUser => {
      const updatedUser = { ...prevUser, avatar: image }
      localStorage.setItem(authSessionKeyUser, JSON.stringify(updatedUser))
      setCookie(authSessionKeyUser, JSON.stringify(updatedUser))
      return updatedUser
    })
  }, [])

  const removeSession = useCallback(() => {
    // Nettoyage localStorage
    localStorage.clear()
    // Nettoyage spécifique
    localStorage.removeItem(authSessionKey)
    localStorage.removeItem(authSessionKeyToken)
    localStorage.removeItem(authSessionKeyUser)
    localStorage.removeItem(authSessionKeyAvatar)
    localStorage.removeItem('isAuthenticated')

    // Nettoyage cookies
    deleteCookie(authSessionKey)
    deleteCookie(authSessionKeyToken)
    deleteCookie(authSessionKeyUser)

    setToken(undefined)
    setUser(undefined)
    setProfileImage(undefined)
  }, [])

  const logout = useCallback(() => {
    removeSession()
  }, [removeSession])

  const getToken = useCallback(() => token, [token])

  const isAuthenticated = useMemo(() => {
    return Boolean(token && user)
  }, [token, user])

  const value = useMemo(
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
      profileImage
    }),
    [token, user, logout, getToken, saveSession, removeSession, saveProfilImage, saveUser, isAuthenticated, profileImage]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

