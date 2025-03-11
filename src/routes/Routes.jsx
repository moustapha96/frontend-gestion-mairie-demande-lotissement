import { useAuthContext } from "@/context"
import { AdminLayout, AgentLayout, AuthLayout, DemandeurLayout, LandingLayout } from "@/layouts"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { adminRoutes, demandeurRoutes, agentRoutes, authRoutes, MairieRoutes } from "./index"
import { useEffect, useRef } from "react"

const AllRoutes = (props) => {
  const { isAuthenticated, user } = useAuthContext()
  const location = useLocation()
  const lastValidRoute = useRef("/");

  useEffect(() => {
    if (isAuthenticated) {
      lastValidRoute.current = location.pathname;
    }
  }, [location.pathname, isAuthenticated]);


  const ProtectedRoute = ({ children, requiredRole }) => {
    // Vérifier d'abord si l'utilisateur est connecté

    console.log(isAuthenticated)
    console.log(user)

    if (!isAuthenticated) {
      // Sauvegarder l'URL actuelle pour rediriger après la connexion
      const returnUrl = encodeURIComponent(location.pathname + location.search)
      return <Navigate to={`/auth/sign-in?returnUrl=${returnUrl}`} replace />
    }

    // Vérifier les rôles
    if (requiredRole) {
      const roles = user?.roles || []

      // Vérification pour admin et super admin
      if ((requiredRole === "ROLE_ADMIN" || requiredRole === "ROLE_SUPER_ADMIN")
        && !roles.includes(requiredRole)) {
        return <Navigate to="/admin/dashboard" replace />
      }

      // Vérification pour demandeur
      if (requiredRole === "ROLE_DEMANDEUR" && !roles.includes(requiredRole)) {
        return <Navigate to="/demandeur/dashboard" replace />
      }

      // Vérification pour agent
      if (requiredRole === "ROLE_AGENT" && !roles.includes(requiredRole)) {
        return <Navigate to="/agent/dashboard" replace />
      }

      // if (requiredRole && !roles.includes(requiredRole)) {
      //   return <Navigate to={lastValidRoute.current} replace />;
      // }

    }

    return children
  }

  // Routes publiques (MairieRoutes)
  const publicRoutes = MairieRoutes.map((route, idx) => (
    <Route
      path={route.path}
      element={<LandingLayout {...props}>{route.element}</LandingLayout>}
      key={`public-${idx}`}
    />
  ))

  // Routes protégées pour l'admin
  const protectedAdminRoutes = adminRoutes.map((route, idx) => (
    <Route
      path={route.path}
      element={
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <AdminLayout {...props}>{route.element}</AdminLayout>
        </ProtectedRoute>
      }
      key={`admin-${idx}`}
    />
  ))

  // Routes protégées pour l'agent
  const protectedAgentRoutes = agentRoutes.map((route, idx) => (
    <Route
      path={route.path}
      element={
        <ProtectedRoute requiredRole="ROLE_AGENT">
          <AgentLayout {...props}>{route.element}</AgentLayout>
        </ProtectedRoute>
      }
      key={`agent-${idx}`}
    />
  ))

  // Routes protégées pour le demandeur
  const protectedDemandeurRoutes = demandeurRoutes.map((route, idx) => (
    <Route
      path={route.path}
      element={
        <ProtectedRoute requiredRole="ROLE_DEMANDEUR">
          <DemandeurLayout {...props}>{route.element}</DemandeurLayout>
        </ProtectedRoute>
      }
      key={`demandeur-${idx}`}
    />
  ))

  // Routes d'authentification
  const authenticationRoutes = authRoutes.map((route, idx) => (
    <Route
      path={route.path}
      element={<AuthLayout {...props}>{route.element}</AuthLayout>}
      key={`auth-${idx}`}
    />
  ))

  return (
    <Routes>
      {publicRoutes}
      {protectedAdminRoutes}
      {protectedAgentRoutes}
      {protectedDemandeurRoutes}
      {authenticationRoutes}
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  )
}

export default AllRoutes

