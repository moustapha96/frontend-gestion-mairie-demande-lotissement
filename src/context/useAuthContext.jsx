// "use client"

// import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react"
// import { deleteCookie, getCookie, setCookie } from "cookies-next"

// const AuthContext = createContext(undefined)

// export function useAuthContext() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuthContext must be used within an AuthProvider")
//   }
//   return context
// }

// const authSessionKey = "__GESTIO-MAIRIE_REACT_AUTH__"
// const authSessionKeyToken = "__GESTIO-MAIRIE_REACT_AUTH__TOKEN"
// const authSessionKeyUser = "__GESTIO-MAIRIE_REACT_AUTH__USER"
// const authSessionKeyAvatar = "__GESTIO-MAIRIE_REACT_AVATAR"
// const KEY_REFRESH     = "__GESTIO-MAIRIE_REACT_AUTH__REFRESH"

// export function AuthProvider({ children }) {
//   // Initialisation avec priorité au localStorage, puis cookies comme fallback
//   const [token, setToken] = useState(() => {
//     const tokenFromStorage = localStorage.getItem(authSessionKeyToken)
//     const tokenFromCookie = getCookie(authSessionKeyToken)
//     return tokenFromStorage ? JSON.parse(tokenFromStorage)
//       : tokenFromCookie ? JSON.parse(tokenFromCookie)
//         : undefined
//   })

//   const [user, setUser] = useState(() => {
//     const userFromStorage = localStorage.getItem(authSessionKeyUser)
//     const userFromCookie = getCookie(authSessionKeyUser)
//     return userFromStorage ? JSON.parse(userFromStorage)
//       : userFromCookie ? JSON.parse(userFromCookie)
//         : undefined
//   })

//   const [profileImage, setProfileImage] = useState(() => {
//     const imageFromStorage = localStorage.getItem(authSessionKeyAvatar)
//     return imageFromStorage ? JSON.parse(imageFromStorage) : undefined
//   })

//   // Synchronisation avec localStorage et cookies
//   useEffect(() => {
//     if (token) {
//       localStorage.setItem(authSessionKeyToken, JSON.stringify(token))
//       setCookie(authSessionKeyToken, JSON.stringify(token))
//     }
//   }, [token])

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem(authSessionKeyUser, JSON.stringify(user))
//       localStorage.setItem('isAuthenticated', 'true')
//       setCookie(authSessionKeyUser, JSON.stringify(user))
//       setCookie(authSessionKey, 'true')
//     }
//   }, [user])

//   const saveSession = useCallback((data) => {
//     if (!data || !data.token || !data.user) return

//     localStorage.setItem(authSessionKey, "true")
//     localStorage.setItem(authSessionKeyToken, JSON.stringify(data.token))
//     localStorage.setItem(authSessionKeyUser, JSON.stringify(data.user))
//     localStorage.setItem('isAuthenticated', 'true')

//     setCookie(authSessionKey, "true")
//     setCookie(authSessionKeyToken, JSON.stringify(data.token))
//     setCookie(authSessionKeyUser, JSON.stringify(data.user))

//     setToken(data.token)
//     setUser(data.user)
//   }, [])

//   const saveUser = useCallback((userData) => {
//     setUser(prevUser => {
//       const updatedUser = { ...prevUser, ...userData }
//       localStorage.setItem(authSessionKeyUser, JSON.stringify(updatedUser))
//       setCookie(authSessionKeyUser, JSON.stringify(updatedUser))
//       return updatedUser
//     })
//   }, [])

//   const saveProfilImage = useCallback((image) => {
//     setProfileImage(image)
//     localStorage.setItem(authSessionKeyAvatar, JSON.stringify(image))
//     setUser(prevUser => {
//       const updatedUser = { ...prevUser, avatar: image }
//       localStorage.setItem(authSessionKeyUser, JSON.stringify(updatedUser))
//       setCookie(authSessionKeyUser, JSON.stringify(updatedUser))
//       return updatedUser
//     })
//   }, [])

//   const removeSession = useCallback(() => {
//     // Nettoyage localStorage
//     localStorage.clear()
//     // Nettoyage spécifique
//     localStorage.removeItem(authSessionKey)
//     localStorage.removeItem(authSessionKeyToken)
//     localStorage.removeItem(authSessionKeyUser)
//     localStorage.removeItem(authSessionKeyAvatar)
//     localStorage.removeItem('isAuthenticated')

//     // Nettoyage cookies
//     deleteCookie(authSessionKey)
//     deleteCookie(authSessionKeyToken)
//     deleteCookie(authSessionKeyUser)

//     setToken(undefined)
//     setUser(undefined)
//     setProfileImage(undefined)
//   }, [])

//   const logout = useCallback(() => {
//     removeSession()
//   }, [removeSession])

//   const getToken = useCallback(() => token, [token])

//   const isAuthenticated = useMemo(() => {
//     return Boolean(token && user)
//   }, [token, user])

//   const value = useMemo(
//     () => ({
//       token,
//       user,
//       logout,
//       getToken,
//       saveSession,
//       removeSession,
//       saveProfilImage,
//       saveUser,
//       isAuthenticated,
//       profileImage
//     }),
//     [token, user, logout, getToken, saveSession, removeSession, saveProfilImage, saveUser, isAuthenticated, profileImage]
//   )

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }


// context/auth.jsx
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

const KEY_AUTH_FLAG   = "__GESTIO-MAIRIE_REACT_AUTH__"
const KEY_ACCESS      = "__GESTIO-MAIRIE_REACT_AUTH__TOKEN"
const KEY_REFRESH     = "__GESTIO-MAIRIE_REACT_AUTH__REFRESH"
const KEY_USER        = "__GESTIO-MAIRIE_REACT_AUTH__USER"
const KEY_AVATAR      = "__GESTIO-MAIRIE_REACT_AVATAR"

function safeParseCookie(key) {
  try { 
    const v = getCookie(key)
    return v ? JSON.parse(v) : undefined
  } catch { return undefined }
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => {
    const v = localStorage.getItem(KEY_ACCESS)
    return v ? JSON.parse(v) : safeParseCookie(KEY_ACCESS)
  })
  const [refreshToken, setRefreshToken] = useState(() => {
    const v = localStorage.getItem(KEY_REFRESH)
    return v ? JSON.parse(v) : safeParseCookie(KEY_REFRESH)
  })
  const [user, setUser] = useState(() => {
    const v = localStorage.getItem(KEY_USER)
    return v ? JSON.parse(v) : safeParseCookie(KEY_USER)
  })
  const [profileImage, setProfileImage] = useState(() => {
    const v = localStorage.getItem(KEY_AVATAR)
    return v ? JSON.parse(v) : undefined
  })

  // sync storage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem(KEY_ACCESS, JSON.stringify(accessToken))
      setCookie(KEY_ACCESS, JSON.stringify(accessToken))
    }
  }, [accessToken])

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem(KEY_REFRESH, JSON.stringify(refreshToken))
      setCookie(KEY_REFRESH, JSON.stringify(refreshToken))
    }
  }, [refreshToken])

  useEffect(() => {
    if (user) {
      localStorage.setItem(KEY_USER, JSON.stringify(user))
      localStorage.setItem('isAuthenticated', 'true')
      setCookie(KEY_USER, JSON.stringify(user))
      setCookie(KEY_AUTH_FLAG, 'true')
    }
  }, [user])

  const saveSession = useCallback(({ token, refresh_token, user: u }) => {
    if (!token || !u) return
    localStorage.setItem(KEY_AUTH_FLAG, "true")
    localStorage.setItem(KEY_ACCESS, JSON.stringify(token))
    if (refresh_token) localStorage.setItem(KEY_REFRESH, JSON.stringify(refresh_token))
    localStorage.setItem(KEY_USER, JSON.stringify(u))
    localStorage.setItem('isAuthenticated', 'true')

    setCookie(KEY_AUTH_FLAG, "true")
    setCookie(KEY_ACCESS, JSON.stringify(token))
    if (refresh_token) setCookie(KEY_REFRESH, JSON.stringify(refresh_token))
    setCookie(KEY_USER, JSON.stringify(u))

    setAccessToken(token)
    if (refresh_token) setRefreshToken(refresh_token)
    setUser(u)
  }, [])

  const saveUser = useCallback((userData) => {
    setUser(prev => {
      const updated = { ...(prev || {}), ...userData }
      localStorage.setItem(KEY_USER, JSON.stringify(updated))
      setCookie(KEY_USER, JSON.stringify(updated))
      return updated
    })
  }, [])

  const saveProfilImage = useCallback((image) => {
    setProfileImage(image)
    localStorage.setItem(KEY_AVATAR, JSON.stringify(image))
    setUser(prev => {
      const updated = { ...(prev || {}), avatar: image }
      localStorage.setItem(KEY_USER, JSON.stringify(updated))
      setCookie(KEY_USER, JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeSession = useCallback(() => {
    localStorage.clear()
    ;[KEY_AUTH_FLAG, KEY_ACCESS, KEY_REFRESH, KEY_USER, KEY_AVATAR, 'isAuthenticated'].forEach(k => localStorage.removeItem(k))
    ;[KEY_AUTH_FLAG, KEY_ACCESS, KEY_REFRESH, KEY_USER].forEach(k => deleteCookie(k))
    setAccessToken(undefined)
    setRefreshToken(undefined)
    setUser(undefined)
    setProfileImage(undefined)
  }, [])

  const logout = useCallback(() => { removeSession() }, [removeSession])

  const getToken = useCallback(() => accessToken, [accessToken])
  const isAuthenticated = useMemo(() => Boolean(accessToken && user), [accessToken, user])

  const value = useMemo(
    () => ({
      token: accessToken,
      refreshToken,
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
    [accessToken, refreshToken, user, logout, getToken, saveSession, removeSession, saveProfilImage, saveUser, isAuthenticated, profileImage]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
