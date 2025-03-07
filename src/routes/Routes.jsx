// import { useAuthContext } from "@/context";
// import {
//   AdminLayout,
//   AgentLayout,
//   AuthLayout,
//   DefaultLAyout,
//   DemandeurLayout,
//   LandingLayout,
// } from "@/layouts";
// import { Navigate, Route, Routes } from "react-router-dom";
// import { adminRoutes, demandeurRoutes, agentRoutes, authRoutes, MairieRoutes } from "./index";


// const AllRoutes = (props) => {
//   const { isAuthenticated, user } = useAuthContext();
//   console.log(user, isAuthenticated);
//   console.log("user route");

//   const ProtectedRoute = ({ children, requiredRole }) => {
//     if (!isAuthenticated) {
//       return <Navigate to="/auth/sign-in" replace />;
//     }

//     if (requiredRole && user.roles !== requiredRole) {
//       return <Navigate to="/admin/dashboard" replace />;
//     }

//     return children;
//   };


//   return (
//     <Routes>

//       {MairieRoutes.map((route, idx) => (
//         <Route
//           path={route.path}
//           element={<LandingLayout {...props}>{route.element}</LandingLayout>}
//           key={idx}
//         />
//       ))}

//       {adminRoutes.map((route, idx) => (
//         <Route
//           path={route.path}
//           element={
//             <ProtectedRoute requiredRole="ROLE_ADMIN">
//               <AdminLayout {...props}>{route.element}</AdminLayout>
//             </ProtectedRoute>
//           }
//           key={idx}
//         />
//       ))}

//       {agentRoutes.map((route, idx) => (
//         <Route
//           path={route.path}
//           element={
//             <ProtectedRoute requiredRole="ROLE_AGENT">
//               <AgentLayout {...props}>{route.element}</AgentLayout>
//             </ProtectedRoute>
//           }
//           key={idx}
//         />
//       ))}

//       {demandeurRoutes.map((route, idx) => (
//         <Route
//           path={route.path}
//           element={
//             <ProtectedRoute requiredRole="ROLE_DEMANDEUR">
//               <DemandeurLayout {...props}>{route.element}</DemandeurLayout>
//             </ProtectedRoute>
//           }
//           key={idx}
//         />
//       ))}


//       {authRoutes.map((route, idx) => (
//         <Route
//           path={route.path}
//           element={<AuthLayout {...props}>{route.element}</AuthLayout>}
//           key={idx}
//         />
//       ))}

//       <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
//     </Routes>
//   );
// };

// export default AllRoutes;
import { useAuthContext } from "@/context"
import { AdminLayout, AgentLayout, AuthLayout, DemandeurLayout, LandingLayout } from "@/layouts"
import { Navigate, Route, Routes } from "react-router-dom"
import { adminRoutes, demandeurRoutes, agentRoutes, authRoutes, MairieRoutes } from "./index"

const AllRoutes = (props) => {
  const { isAuthenticated, user } = useAuthContext()


  const ProtectedRoute = ({ children, requiredRole }) => {

    // console.log("Vérification de l'authentification :", isAuthenticated, user);


    if (!isAuthenticated) {
      return <Navigate to="/auth/sign-in" replace />
    }

    if (requiredRole && (!user || !user.roles || !user.roles.includes(requiredRole))) {
      return <Navigate to="/admin/dashboard" replace />
    }

    return children
  }

  return (
    <Routes>
      {MairieRoutes.map((route, idx) => (
        <Route path={route.path} element={<LandingLayout {...props}>{route.element}</LandingLayout>} key={idx} />
      ))}

      {adminRoutes.map((route, idx) => (
        <Route
          path={route.path}
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminLayout {...props}>{route.element}</AdminLayout>
            </ProtectedRoute>
          }
          key={idx}
        />
      ))}

      {agentRoutes.map((route, idx) => (
        <Route
          path={route.path}
          element={
            <ProtectedRoute requiredRole="ROLE_AGENT">
              <AgentLayout {...props}>{route.element}</AgentLayout>
            </ProtectedRoute>
          }
          key={idx}
        />
      ))}

      {demandeurRoutes.map((route, idx) => (
        <Route
          path={route.path}
          element={
            <ProtectedRoute requiredRole="ROLE_DEMANDEUR">
              <DemandeurLayout {...props}>{route.element}</DemandeurLayout>
            </ProtectedRoute>
          }
          key={idx}
        />
      ))}

      {authRoutes.map((route, idx) => (
        <Route path={route.path} element={<AuthLayout {...props}>{route.element}</AuthLayout>} key={idx} />
      ))}

      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  )
}

export default AllRoutes

