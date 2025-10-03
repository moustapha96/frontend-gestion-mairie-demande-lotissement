// src/routes/AllRoutes.jsx
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context";
import { AdminLayout, AgentLayout, AuthLayout, DemandeurLayout, LandingLayout } from "@/layouts";
import { adminRoutes, demandeurRoutes, agentRoutes, authRoutes, MairieRoutes } from "./index";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "@/pages/auth/unauthorized";


const AllRoutes = (props) => {
  const { isAuthenticated, user } = useAuthContext();
  const location = useLocation();

  // Routes publiques
  const publicRoutes = MairieRoutes.map((route, idx) => (
    <Route
      path={route.path}
      element={<LandingLayout {...props}>{route.element}</LandingLayout>}
      key={`public-${idx}`}
    />
  ));

  // Routes protégées pour l'admin
  const protectedAdminRoutes = adminRoutes.map((route, idx) => (
    <Route
      path={route.path}
      element={
        <ProtectedRoute requiredRoles={[
          "ROLE_ADMIN", "ROLE_SUPER_ADMIN","ROLE_MAIRE","ROLE_CHEF_SERVICE",
          "ROLE_PRESIDENT_COMMISSION", "ROLE_PERCEPTEUR","ROLE_AGENT"]
          }>
          <AdminLayout {...props}>{route.element}</AdminLayout>
        </ProtectedRoute>
      }
      key={`admin-${idx}`}
    />
  ));

  // Routes protégées pour l'agent
  const protectedAgentRoutes = agentRoutes.map((route, idx) => (
    <Route
      path={route.path}
      element={
        <ProtectedRoute requiredRoles={["ROLE_AGENT"]}>
          <AgentLayout {...props}>{route.element}</AgentLayout>
        </ProtectedRoute>
      }
      key={`agent-${idx}`}
    />
  ));

  // Routes protégées pour le demandeur
  const protectedDemandeurRoutes = demandeurRoutes.map((route, idx) => (
    <Route
      path={route.path}
      element={
        <ProtectedRoute requiredRoles={["ROLE_DEMANDEUR"]}>
          <DemandeurLayout {...props}>{route.element}</DemandeurLayout>
        </ProtectedRoute>
      }
      key={`demandeur-${idx}`}
    />
  ));

  // Routes d'authentification
  const authenticationRoutes = authRoutes.map((route, idx) => (
    <Route
      path={route.path}
      element={<AuthLayout {...props}>{route.element}</AuthLayout>}
      key={`auth-${idx}`}
    />
  ));

  return (
    <Routes>
      {publicRoutes}
      {protectedAdminRoutes}
      {protectedAgentRoutes}
      {protectedDemandeurRoutes}
      {authenticationRoutes}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
};

export default AllRoutes;
