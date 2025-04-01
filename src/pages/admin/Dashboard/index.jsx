
"use client"

import { useState, useEffect } from "react"
import { AdminBreadcrumb } from "@/components"
import { LuUsers, LuFileText, LuLayoutGrid, LuCheckSquare, LuClock, LuXCircle } from "react-icons/lu"
import { getDemandes } from "@/services/demandeService"
import { getLotissements } from "@/services/lotissementService"
import { getLocalites } from "@/services/localiteService"
import { getDemandeurListe } from "@/services/userService"
import { getLots } from "@/services/lotsService"
import { getPlanLotissements } from "@/services/planLotissement"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

const AdminDashboard = () => {
  // Individual loading states for each API call
  const [loadingDemandes, setLoadingDemandes] = useState(false)
  const [loadingLotissements, setLoadingLotissements] = useState(false)
  const [loadingLocalites, setLoadingLocalites] = useState(false)
  const [loadingUtilisateurs, setLoadingUtilisateurs] = useState(false)
  const [loadingLots, setLoadingLots] = useState(false)
  const [loadingPlans, setLoadingPlans] = useState(false)

  const [stats, setStats] = useState({
    demandes: {
      total: 0,
      EN_COURS: 0,
      EN_TRAITEMENT: 0,
      VALIDE: 0,
      REJETE: 0,
    },
    terrains: {
      total: 0,
      disponibles: 0,
      occupes: 0,
    },
    utilisateurs: {
      total: 0,
      actifs: 0,
      inactifs: 0,
    },
    localites: {
      total: 0,
    },
    lotissements: {
      total: 0,
      en_cours: 0,
      acheve: 0,
      rejete: 0,
      planifie: 0,
    },
    lots: {
      total: 0,
      disponibles: 0,
      occupes: 0,
      reserves: 0,
      vendus: 0,
    },
    planLotissements: {
      total: 0,
      enCours: 0,
      valides: 0,
    },
  })

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch demandes
      setLoadingDemandes(true)
      try {
        const demandes = await getDemandes()
        setStats((prev) => ({
          ...prev,
          demandes: {
            total: demandes.length,
            EN_COURS: demandes.filter((d) => d.statut === "EN_COURS").length,
            EN_TRAITEMENT: demandes.filter((d) => d.statut === "EN_TRAITEMENT").length,
            VALIDE: demandes.filter((d) => d.statut === "VALIDE").length,
            REJETE: demandes.filter((d) => d.statut === "REJETE").length,
          },
        }))
      } catch (error) {
        console.error("Erreur lors du chargement des demandes:", error)
      } finally {
        setLoadingDemandes(false)
      }

      // Fetch lotissements
      setLoadingLotissements(true)
      try {
        const lotissements = await getLotissements()
        setStats((prev) => ({
          ...prev,
          terrains: {
            total: lotissements.reduce((acc, lot) => acc + lot.nombreTerrains, 0),
            disponibles: lotissements.reduce((acc, lot) => acc + lot.terrainsDisponibles, 0),
            occupes: lotissements.reduce((acc, lot) => acc + (lot.nombreTerrains - lot.terrainsDisponibles), 0),
          },
          lotissements: {
            total: lotissements.length,
            en_cours: lotissements.filter((lotissement) => lotissement.statut === "en_cours").length,
            acheve: lotissements.filter((lotissement) => lotissement.statut === "acheve").length,
            rejete: lotissements.filter((lotissement) => lotissement.statut === "rejete").length,
            planifie: lotissements.filter((lotissement) => lotissement.statut === "planifié").length,
          },
        }))
      } catch (error) {
        console.error("Erreur lors du chargement des lotissements:", error)
      } finally {
        setLoadingLotissements(false)
      }

      // Fetch localites
      setLoadingLocalites(true)
      try {
        const localites = await getLocalites()
        setStats((prev) => ({
          ...prev,
          localites: {
            total: localites.length,
          },
        }))
      } catch (error) {
        console.error("Erreur lors du chargement des localités:", error)
      } finally {
        setLoadingLocalites(false)
      }

      // Fetch utilisateurs
      setLoadingUtilisateurs(true)
      try {
        const utilisateurs = await getDemandeurListe()
        const demandeurs = utilisateurs.filter((u) => u.roles.includes("ROLE_DEMANDEUR"))
        setStats((prev) => ({
          ...prev,
          utilisateurs: {
            total: demandeurs.length,
            actifs: demandeurs.filter((u) => u.activated).length,
            inactifs: demandeurs.filter((u) => !u.activated).length,
          },
        }))
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error)
      } finally {
        setLoadingUtilisateurs(false)
      }

      // Fetch lots
      setLoadingLots(true)
      try {
        const lots = await getLots()
        console.log(lots)
        console.log("lots.data", lots)
        setStats((prev) => ({
          ...prev,
          lots: {
            total: lots.length,
            disponibles: lots.filter((lot) => lot.statut === "DISPONIBLE").length,
            occupes: lots.filter((lot) => lot.statut === "OCCUPE").length,
            reserves: lots.filter((lot) => lot.statut === "RESERVE").length,
          },
        }))

      } catch (error) {
        console.error("Erreur lors du chargement des lots:", error)
      } finally {
        setLoadingLots(false)
      }

      // Fetch plans
      setLoadingPlans(true)
      try {
        const plans = await getPlanLotissements()
        setStats((prev) => ({
          ...prev,
          planLotissements: {
            total: plans.length,
            enCours: plans.filter((plan) => plan.statut === "EN_COURS").length,
            valides: plans.filter((plan) => plan.statut === "VALIDE").length,
          },
        }))
      } catch (error) {
        console.error("Erreur lors du chargement des plans:", error)
      } finally {
        setLoadingPlans(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <>
      <AdminBreadcrumb title="Tableau de bord" />
      <section className="py-8">
        <div className="container">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Demandes"
              lien="/admin/demandes"
              icon={<LuFileText className="w-8 h-8 text-primary" />}
              total={stats.demandes.total}
              items={[
                { label: "En cours", value: stats.demandes.EN_COURS, icon: <LuClock className="w-4 h-4" /> },
                {
                  label: "En traitement",
                  value: stats.demandes.EN_TRAITEMENT,
                  icon: <LuCheckSquare className="w-4 h-4" />,
                },
                { label: "Validées", value: stats.demandes.VALIDE, icon: <LuCheckSquare className="w-4 h-4" /> },
                { label: "Rejetées", value: stats.demandes.REJETE, icon: <LuXCircle className="w-4 h-4" /> },
              ]}
              loading={loadingDemandes}
            />

            <StatCard
              title="Demandeurs"
              lien="/admin/demandeurs"
              icon={<LuUsers className="w-8 h-8 text-blue-600" />}
              total={stats.utilisateurs.total}
              items={[
                { label: "Actifs", value: stats.utilisateurs.actifs },
                { label: "Inactifs", value: stats.utilisateurs.inactifs },
              ]}
              loading={loadingUtilisateurs}
            />

            <StatCard
              title="Localités"
              lien="/admin/localites"
              icon={<LuLayoutGrid className="w-8 h-8 text-purple-600" />}
              total={stats.localites.total}
              items={[
                { label: "Lotissements", value: stats.lotissements.total },
                { label: "Plans de lotissement", value: stats.planLotissements.total },
              ]}
              loading={loadingLocalites || loadingLotissements || loadingPlans}
            />

            <StatCard
              title="Lots"
              lien="/admin/lots"
              icon={<LuLayoutGrid className="w-8 h-8 text-yellow-600" />}
              total={stats.lots.total}
              items={[
                { label: "Disponibles", value: stats.lots.disponibles, icon: <LuCheckSquare className="w-4 h-4" /> },
                { label: "Occupés", value: stats.lots.occupes, icon: <LuUsers className="w-4 h-4" /> },
                { label: "Réservés", value: stats.lots.reserves, icon: <LuClock className="w-4 h-4" /> },

              ]}
              loading={loadingLots}
            />

            <StatCard
              title="Lotissements"
              lien="/admin/lotissements"
              icon={<LuLayoutGrid className="w-8 h-8 text-yellow-600" />}
              total={stats.lotissements.total}
              items={[
                { label: "En cours", value: stats.lotissements.en_cours, icon: <LuClock className="w-4 h-4" /> },
                { label: "Achèvés", value: stats.lotissements.acheve, icon: <LuUsers className="w-4 h-4" /> },
                { label: "Rejetés", value: stats.lotissements.rejete, icon: <LuClock className="w-4 h-4" /> },
                { label: "Planifiés", value: stats.lotissements.planifie, icon: <LuClock className="w-4 h-4" /> },
              ]}
              loading={loadingLotissements}
            />
          </div>
        </div>
      </section>
    </>
  )
}

const StatCard = ({ title, icon, total, items, loading, lien = null }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <Link to={lien}>{icon}</Link>
    </div>
    <p className="text-3xl font-bold text-gray-900 mb-4">{total}</p>
    {!loading && (
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="text-gray-500">{item.label}</span>
            </div>
            <span className="font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    )}
    {loading && (
      <div className="w-full py-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )}
  </div>
)

export default AdminDashboard

