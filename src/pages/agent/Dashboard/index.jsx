
import { useState, useEffect } from "react";
import { AdminBreadcrumb } from "@/components";
import {
  LuUsers,
  LuFileText,
  LuMap,
  LuLayoutGrid,
  LuWallet,
  LuCheckSquare,
  LuClock,
  LuXCircle
} from "react-icons/lu";
import { getDemandes } from "@/services/demandeService";
import { getLotissements } from "@/services/lotissementService";
import { getLocalites } from "@/services/localiteService";
import { getDemandeurListe } from "@/services/userService";
import { getLots } from "@/services/lotsService";
import { getPlanLotissements } from "@/services/planLotissement";
import { Loader2 } from "lucide-react";

const DashboardAgent = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    demandes: {
      total: 0,
      enCours: 0,
      approuvees: 0,
      rejetees: 0
    },
    terrains: {
      total: 0,
      disponibles: 0,
      occupes: 0
    },
    utilisateurs: {
      total: 0,
      actifs: 0,
      inactifs: 0
    },
    localites: {
      total: 0
    },
    lotissements: {
      total: 0
    },
    lots: {
      total: 0,
      disponibles: 0,
      occupes: 0,
      reserves: 0
    },
    planLotissements: {
      total: 0,
      enCours: 0,
      valides: 0
    }
  });

  useEffect(() => {
    setLoading(true)
    const fetchStats = async () => {
      try {
        const [demandes, lotissements, localites, utilisateurs, lots, plans] = await Promise.all([
          getDemandes(),
          getLotissements(),
          getLocalites(),
          getDemandeurListe(),
          getLots(),
          getPlanLotissements()
        ]);

        console.log(lots);
        console.log("lots");
        // Calcul des statistiques
        const statsData = {
          demandes: {
            total: demandes.length,
            enCours: demandes.filter(d => d.statut === 'EN_COURS').length,
            approuvees: demandes.filter(d => d.statut === 'VALIDE').length,
            rejetees: demandes.filter(d => d.statut === 'REJETE').length,
            traitement: demandes.filter(d => d.statut === 'EN_TRAITEMENT').length
          },
          terrains: {
            total: lotissements.reduce((acc, lot) => acc + lot.nombreTerrains, 0),
            disponibles: lotissements.reduce((acc, lot) => acc + lot.terrainsDisponibles, 0),
            occupes: lotissements.reduce((acc, lot) => acc + (lot.nombreTerrains - lot.terrainsDisponibles), 0)
          },
          utilisateurs: {
            total: utilisateurs.length,
            actifs: utilisateurs.filter(u => u.activated).length,
            inactifs: utilisateurs.filter(u => !u.activated).length
          },
          localites: {
            total: localites.length
          },
          lotissements: {
            total: lotissements.length,
            en_cours: lotissements.filter(lotissement => lotissement.statut === 'en_cours').length,
            acheve: lotissements.filter(lotissement => lotissement.statut === 'acheve').length,
            rejete: lotissements.filter(lotissement => lotissement.statut === 'rejete').length,
            planifie: lotissements.filter(lotissement => lotissement.statut === 'planifié').length
          },
          lots: {
            total: lots.length,
            disponibles: lots.filter(lot => lot.statut === "DISPONIBLE").length,
            occupes: lots.filter(lot => lot.statut === 'OCCUPE').length,
            reserves: lots.filter(lot => lot.statut === "RESERVER").length,
            vendus: lots.filter(lot => lot.statut === 'VENDU').length
          },
          planLotissements: {
            total: plans.length,
            enCours: plans.filter(plan => plan.statut === 'EN_COURS').length,
            valides: plans.filter(plan => plan.statut === 'VALIDE').length
          }
        };

        setStats(statsData);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <AdminBreadcrumb title="Tableau de bord" />
      <section className="py-8">
        <div className="container">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Demandes"
              icon={<LuFileText className="w-8 h-8 text-primary" />}
              total={stats.demandes.total}
              items={[
                { label: "En cours", value: stats.demandes.enCours, icon: <LuClock className="w-4 h-4" /> },
                { label: "Approuvées", value: stats.demandes.approuvees, icon: <LuCheckSquare className="w-4 h-4" /> },
                { label: "Rejetées", value: stats.demandes.rejetees, icon: <LuXCircle className="w-4 h-4" /> }
              ]}
              loading={loading}
            />

            {/* <StatCard
              title="Terrains"
              icon={<LuMap className="w-8 h-8 text-green-600" />}
              total={stats.terrains.total}
              items={[
                { label: "Disponibles", value: stats.terrains.disponibles },
                { label: "Occupés", value: stats.terrains.occupes }
              ]}
            /> */}

            <StatCard
              title="Utilisateurs"
              icon={<LuUsers className="w-8 h-8 text-blue-600" />}
              total={stats.utilisateurs.total}
              items={[
                { label: "Actifs", value: stats.utilisateurs.actifs },
                { label: "Inactifs", value: stats.utilisateurs.inactifs }
              ]}
              loading={loading}
            />

            <StatCard
              title="Localités"
              icon={<LuLayoutGrid className="w-8 h-8 text-purple-600" />}
              total={stats.localites.total}
              items={[
                { label: "Lotissements", value: stats.lotissements.total },
                { label: "Plans de lotissement", value: stats.planLotissements.total }
              ]}
              loading={loading}
            />

            <StatCard
              title="Lots"
              icon={<LuLayoutGrid className="w-8 h-8 text-yellow-600" />}
              total={stats.lots.total}
              items={[
                { label: "Disponibles", value: stats.lots.disponibles, icon: <LuCheckSquare className="w-4 h-4" /> },
                { label: "Occupés", value: stats.lots.occupes, icon: <LuUsers className="w-4 h-4" /> },
                { label: "Réservés", value: stats.lots.reserves, icon: <LuClock className="w-4 h-4" /> },
                { label: "Vendus", value: stats.lots.vendus, icon: <LuCheckSquare className="w-4 h-4" /> }
              ]}
              loading={loading}
            />
            <StatCard
              title="Lotissements"
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

            {/* <StatCard
              title="Plans de lotissement"
              icon={<LuMap className="w-8 h-8 text-indigo-600" />}
              total={stats.planLotissements.total}
              items={[
                { label: "En cours", value: stats.planLotissements.enCours, icon: <LuClock className="w-4 h-4" /> },
                { label: "Validés", value: stats.planLotissements.valides, icon: <LuCheckSquare className="w-4 h-4" /> }
              ]}
            /> */}
          </div>

          {/* Graphiques et autres widgets */}
          {/* ... Ajoutez ici d'autres composants pour les graphiques et widgets */}
        </div>
      </section>
    </>
  );
};

const StatCard = ({ title, icon, total, items, loading }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {icon}
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
      <tbody className="w-full">
        <tr>
          <td colSpan="5" className="px-6 py-12">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </td>
        </tr>
      </tbody>
    )}
  </div>
);

export default DashboardAgent;