import { lazy } from "react";
import AdminConfiguration from "@/pages/admin/Configuration";

import SignUpInstitut from "@/pages/auth/SignUpInstitut";
import SignUpDemandeur from "@/pages/auth/SignUpDemandeur";
import AdminProfil from "@/pages/admin/Profil";
import AdminCompte from "@/pages/admin/Compte";

import ActivatedAccount from "@/pages/auth/activated";
import InvitationInstitut from "@/pages/auth/InvitationInstitut";

import AdminClient from "@/pages/admin/Clients";
import AdminClientDetail from "@/pages/admin/Clients/AdminClientDetail";

import DashboardDemandeur from "@/pages/demandeur/Dashboard";
import DashboardAgent from "@/pages/agent/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import Finance from "@/pages/landing/Finance";
import DemandeNouveau from "@/pages/demandeur/Demande/components/DemandeNouveau";
import DemandeurProfile from "@/pages/demandeur/Profile";
import AdminDemandeDetails from "@/pages/admin/Demande/components/DemandeDetails";
import AdminDemandeurDetails from "@/pages/admin/Demandeur/components/DemandeurDetail";

import AdminLotissementListe from "@/pages/admin/Lotissement";
import AdminLotissementDetails from "@/pages/admin/Lotissement/components/LotissementDetails";
import AdminLotissementPlan from "@/pages/admin/Lotissement/components/LotissementPlan";
import AdminLotissementLot from "@/pages/admin/Lotissement/components/LotissementLot";
import AdminLocaliteListe from "@/pages/admin/Localite";
import AdminLocaliteAjouter from "@/pages/admin/Localite/components/LocaliteAjout";
import AdminLocaliteModifier from "@/pages/admin/Localite/components/LocaliteUpdate";
import AdminLotissementAjouter from "@/pages/admin/Lotissement/components/LotissementAjouter";
import AdminLotissementModifier from "@/pages/admin/Lotissement/components/LotissementUpdate";
import AdminLot from "@/pages/admin/Lot";
import AdminPlan from "@/pages/admin/Plan/inex";
import AdminDemandeurListe from "@/pages/admin/Demandeur";
import AdminDemandeListe from "@/pages/admin/Demande";
import AdminDemandeConfirmation from "@/pages/admin/Demande/components/DemandeConfirmation";
import AdminParcelle from "@/pages/admin/Parcelle";
import AdminLocaliteLotissement from "@/pages/admin/Localite/components/LocaliteLotissement";
import AdminLocaliteLotissementAjouter from "@/pages/admin/Localite/components/LocaliteLotissementAjout";
import AdminLocaliteDetails from "@/pages/admin/Localite/components/LocaliteDetails";
import AdminDocument from "@/pages/admin/Document";
import AdminMailer from "@/pages/admin/Mailer";
import InscriptionPage from "@/pages/auth/Inscription";
import AgentDocument from "@/pages/agent/Document";
import AgentLocaliteModifier from "@/pages/agent/Localite/components/LocaliteUpdate";
import AgentLocaliteAjouter from "@/pages/agent/Localite/components/LocaliteAjout";
import AgentLocaliteLotissementAjouter from "@/pages/agent/Localite/components/LocaliteLotissementAjout";
import AgentLocaliteDetails from "@/pages/agent/Localite/components/LocaliteDetails";
import AgentLocaliteListe from "@/pages/agent/Localite";
import AgentLotissementLot from "@/pages/agent/Lotissement/components/LotissementLot";
import AgentParcelle from "@/pages/agent/Parcelle";
import AgentPlan from "@/pages/agent/Plan/inex";
import AgentLot from "@/pages/agent/Lot";
import AgentLotissementPlan from "@/pages/agent/Lotissement/components/LotissementPlan";
import AgentLotissementDetails from "@/pages/agent/Lotissement/components/LotissementDetails";
import AgentLotissementModifier from "@/pages/agent/Lotissement/components/LotissementUpdate";
import AgentLotissementAjouter from "@/pages/agent/Lotissement/components/LotissementAjouter";
import AgentLotissementListe from "@/pages/agent/Lotissement";
import AgentDemandeurListe from "@/pages/agent/Demandeur";
import AgentDemandeurDetails from "@/pages/agent/Demandeur/components/DemandeurDetail";
import AgentDemandeConfirmation from "@/pages/agent/Demande/components/DemandeConfirmation";
import AgentDemandeDetails from "@/pages/agent/Demande/components/DemandeDetails";
import AgentDemandeListe from "@/pages/agent/Demande";
import AgentProfile from "@/pages/agent/Profil";
import AdminMap from "@/pages/admin/Map";
import AdminDocumentModel from "../pages/admin/DocumentModel";
import AdminDemandeurDemandes from "../pages/admin/Demandeur/components/DemandeurDemandes";
import DemandeurDemandeModification from "../pages/demandeur/Demande/components/DemandeModification";



const DemandeurDemandeDetails = lazy(() => import("@/pages/demandeur/Demande/components/DemandeDetails"));

const DemandeurDocument = lazy(() => import("@/pages/demandeur/Document"));
const DemandeurDemande = lazy(() => import("@/pages/demandeur/Demande"));

// landing routes
const NouvelleDemandePage = lazy(() => import("@/pages/landing/NouvelleDemande"));
// admin routes
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
// auth routes
const SignIn = lazy(() => import("@/pages/auth/SignIn"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const Logout = lazy(() => import("@/pages/auth/Logout"));


const agentRoutes = [
  {
    path: "/agent/dashboard",
    element: <DashboardAgent />,
  },
  {
    path: '/agent/demandes',
    element: <AgentDemandeListe />
  },
  {
    path: '/agent/demandes/:id/details',
    element: <AgentDemandeDetails />
  },
  {
    path: '/agent/demandes/:id/confirmation',
    element: <AgentDemandeConfirmation />
  },

  {
    path: '/agent/demandeur/:id/details',
    element: <AgentDemandeurDetails />
  },
  {
    path: '/agent/demandeurs',
    element: <AgentDemandeurListe />
  },
  {
    path: '/agent/lotissements',
    element: <AgentLotissementListe />
  },
  {
    path: '/agent/lotissements/nouveau',
    element: <AgentLotissementAjouter />
  },
  {
    path: '/agent/lotissements/:id/modification',
    element: <AgentLotissementModifier />
  },
  {
    path: '/agent/lotissements/:id/details',
    element: <AgentLotissementDetails />
  },
  {
    path: '/agent/lotissements/:id/plans',
    element: <AgentLotissementPlan />
  },
  {
    path: '/agent/lots',
    element: <AgentLot />
  },
  {
    path: '/agent/plans',
    element: <AgentPlan />
  },
  {
    path: '/agent/parcelles',
    element: <AgentParcelle />
  },
  {
    path: '/agent/lotissements/:id/lots',
    element: <AgentLotissementLot />
  },
  {
    path: '/agent/localites',
    element: <AgentLocaliteListe />
  },
  {
    path: '/agent/localites/:id/details',
    element: <AgentLocaliteDetails />
  },
  // {
  //   path: '/agent/localites/:id/lotissements',
  //   element: <AgentLocaliteLotissement />
  // },
  {
    path: '/agent/localites/:id/lotissements/nouveau',
    element: <AgentLocaliteLotissementAjouter />
  },
  {
    path: '/agent/localites/nouvelle',
    element: <AgentLocaliteAjouter />
  },
  {
    path: '/agent/localites/:id/modification',
    element: <AgentLocaliteModifier />
  },
  {
    path: '/agent/documents',
    element: <AgentDocument />
  },
  {
    path: '/agent/profile',
    element: <AgentProfile />
  }

]

const demandeurRoutes = [
  {
    path: "/demandeur/dashboard",
    element: <DashboardDemandeur />,
  },
  {
    path: "/demandeur/demandes",
    element: <DemandeurDemande />,
  },
  {
    path: "/demandeur/demandes/:id/details",
    element: <DemandeurDemandeDetails />,
  },
  {
    path: "/demandeur/demandes/:id/modification",
    element: <DemandeurDemandeModification />,
  },
  {
    path: "/demandeur/nouveau-demande",
    element: <DemandeNouveau />
  },
  {
    path: "/demandeur/nouvelle-demande",
    element: <NouvelleDemandePage />,
  }, {
    path: "/demandeur/documents",
    element: <DemandeurDocument />,
  },
  {
    path: "/demandeur/profile",
    element: <DemandeurProfile />,
  }
]

const MairieRoutes = [
  {
    path: "/",
    element: <Finance />,
  },
  {
    path: "/nouvelle-demande",
    element: <NouvelleDemandePage />,
  },
  {
    path: '/inscription',
    element: <InscriptionPage />
  }
];




const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/maps",
    element: <AdminMap />
  },
  {
    'path': '/admin/clients',
    element: <AdminClient />,
  },
  {
    'path': '/admin/clients/:id/details',
    element: <AdminClientDetail />,
  },
  {
    'path': '/admin/configurations',
    element: <AdminConfiguration />,
  },
  {
    'path': '/admin/profile',
    element: <AdminProfil />,
  },

  {
    'path': '/admin/comptes',
    element: <AdminCompte />,
  },
  {
    path: '/admin/demandes',
    element: <AdminDemandeListe />
  },
  {
    path: '/admin/demandes/:id/details',
    element: <AdminDemandeDetails />
  },
  {
    path: '/admin/demandes/:id/confirmation',
    element: <AdminDemandeConfirmation />
  },

  {
    path: '/admin/demandeur/:id/details',
    element: <AdminDemandeurDetails />
  },
  {
    path: '/admin/demandeurs',
    element: <AdminDemandeurListe />
  },
  {
    path: '/admin/demandeur/:id/demandes',
    element: <AdminDemandeurDemandes />
  },
  {
    path: '/admin/lotissements',
    element: <AdminLotissementListe />
  },
  {
    path: '/admin/lotissements/nouveau',
    element: <AdminLotissementAjouter />
  },
  {
    path: '/admin/lotissements/:id/modification',
    element: <AdminLotissementModifier />
  },
  {
    path: '/admin/lotissements/:id/details',
    element: <AdminLotissementDetails />
  },
  {
    path: '/admin/lotissements/:id/plans',
    element: <AdminLotissementPlan />
  },
  {
    path: '/admin/lots',
    element: <AdminLot />
  },
  {
    path: '/admin/plans',
    element: <AdminPlan />
  },
  {
    path: '/admin/parcelles',
    element: <AdminParcelle />
  },
  {
    path: '/admin/lotissements/:id/lots',
    element: <AdminLotissementLot />
  },
  {
    path: '/admin/localites',
    element: <AdminLocaliteListe />
  },
  {
    path: '/admin/localites/:id/details',
    element: <AdminLocaliteDetails />
  },
  {
    path: '/admin/localites/:id/lotissements',
    element: <AdminLocaliteLotissement />
  },
  {
    path: '/admin/localites/:id/lotissements/nouveau',
    element: <AdminLocaliteLotissementAjouter />
  },
  {
    path: '/admin/localites/nouvelle',
    element: <AdminLocaliteAjouter />
  },
  {
    path: '/admin/localites/:id/modification',
    element: <AdminLocaliteModifier />
  },
  {
    path: '/admin/documents',
    element: <AdminDocument />
  },
  {
    path: '/admin/mailer',
    element: <AdminMailer />
  },
  {
    path: "/admin/document-models",
    element: <AdminDocumentModel />,
    requiredRole: "ROLE_SUPER_ADMIN"
  }
];

const authRoutes = [
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/auth/sign-in",
    element: <SignIn />,
  },
  {
    path: "/auth/institut",
    element: <SignUpInstitut />,
  },
  {
    path: "/auth/demandeur",
    element: <SignUpDemandeur />,
  },
  {
    path: "/auth/sign-up",
    element: <SignUp />,
  },
  {
    path: "/auth/reset-pass",
    element: <ResetPassword />,
  },
  {
    path: "/auth/forgot-pass",
    element: <ForgotPassword />,
  },
  {
    path: "/auth/logout",
    element: <Logout />,
  },
  {
    path: "/activate",
    element: <ActivatedAccount />
  },
  {
    path: "/invitation-institut",
    element: <InvitationInstitut />
  }

  // 
];

export { adminRoutes, demandeurRoutes, agentRoutes, authRoutes, MairieRoutes };
