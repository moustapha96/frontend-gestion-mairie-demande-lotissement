// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user } = useAuthContext();
  const location = useLocation();

  // Si l'utilisateur n'est pas connecté, redirigez vers la page de connexion
  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/sign-in?returnUrl=${returnUrl}`} replace />;
  }

  // Si des rôles sont requis, vérifiez si l'utilisateur a au moins un des rôles requis
  if (requiredRoles.length > 0) {
    const userRoles = user?.roles || [];
    const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      // Redirigez vers une page "non autorisé" si l'utilisateur n'a pas les rôles requis
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si tout est OK, affichez les enfants
  return children;
};

export default ProtectedRoute;
