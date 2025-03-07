import { createContext, useContext, useState, useMemo } from "react";
import { deleteCookie, hasCookie, getCookie, setCookie } from "cookies-next";



// Création du contexte
const AuthContext = createContext(undefined);

// Hook personnalisé pour utiliser le contexte
export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}

const authSessionKey = "__AUTHENTIC_PAGE_REACT_AUTH__";

export function AuthProvider({ children }) {
    const [session, setSession] = useState(() => {
        const cookie = getCookie(authSessionKey);
        return cookie ? JSON.parse(cookie) : undefined;
    });

    // Fonction pour sauvegarder la session
    const saveSession = (data) => {
        const { token, user } = data;
        const userData = { token, user };
        setCookie(authSessionKey, JSON.stringify(userData));
        setSession(userData);
    };

    // Fonction pour supprimer la session
    const removeSession = () => {
        if (session) {
            deleteCookie(authSessionKey);
            setSession(undefined);
        }
    };

    // Valeurs fournies par le contexte
    const value = useMemo(() => ({
        session,
        isAuthenticated: hasCookie(authSessionKey),
        saveSession,
        removeSession,
    }), [session]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


