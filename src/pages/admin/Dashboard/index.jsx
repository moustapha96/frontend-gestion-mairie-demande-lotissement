"use client"

import { useState, useEffect } from "react"
import { AdminBreadcrumb } from "@/components"
import { LuUsers, LuFileText, LuLayoutGrid, LuCheckSquare, LuClock, LuXCircle } from "react-icons/lu"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { Statistiques } from "@/services/statistiqueService"

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false)

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
      setLoading(true)
      try {
        // Appel à ton service qui fait GET /api/statistiques
        const data = await Statistiques()
        // Helper: récupère une clé numérique sans planter
        const n = (k) => Number(data?.[k] ?? 0)

        setStats((prev) => ({
          ...prev,
          demandes: {
            ...prev.demandes,
            total: n("demande_terrains"),
            // Ces champs ne sont pas fournis par le backend; laissent 0 pour l’instant
            EN_COURS: 0,
            EN_TRAITEMENT: 0,
            VALIDE: 0,
            REJETE: 0,
          },
          utilisateurs: {
            ...prev.utilisateurs,
            total: n("users"),
            actifs: 0,
            inactifs: 0,
          },
          localites: {
            total: n("quartiers"),
          },
          lotissements: {
            ...prev.lotissements,
            total: n("lotissements"),
            en_cours: 0,
            acheve: 0,
            rejete: 0,
            planifie: 0,
          },
          lots: {
            ...prev.lots,
            total: n("lots"),
            disponibles: 0,
            occupes: 0,
            reserves: 0,
            vendus: 0,
          },
          planLotissements: {
            ...prev.planLotissements,
            total: n("plan_lotissements"),
            enCours: 0,
            valides: 0,
          },
          // terrains.total (si tu veux refléter "parcelles")
          terrains: {
            ...prev.terrains,
            total: n("parcelles"),
            disponibles: 0,
            occupes: 0,
          },
        }))
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error)
      } finally {
        setLoading(false)
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
              loading={loading}
            />

            <StatCard
              title="Demandeurs"
              lien="/admin/demandeurs"
              icon={<LuUsers className="w-8 h-8 text-blue-600" />}
              total={stats.utilisateurs.total}
              loading={loading}
            />

            <StatCard
              title="Localités"
              lien="/admin/quartiers"
              icon={<LuLayoutGrid className="w-8 h-8 text-purple-600" />}
              total={stats.localites.total}
              items={[
                { label: "Lotissements", value: stats.lotissements.total },
                { label: "Plans de lotissement", value: stats.planLotissements.total },
              ]}
              loading={loading}
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
              loading={loading}
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
              loading={loading}
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
      {lien ? <Link to={lien}>{icon}</Link> : icon}
    </div>
    <p className="text-3xl font-bold text-gray-900 mb-4">{total}</p>
    {!loading && (
      <div className="space-y-2">
        {/* {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="text-gray-500">{item.label}</span>
            </div>
            <span className="font-medium text-gray-900">{item.value}</span>
          </div>
        ))} */}
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
