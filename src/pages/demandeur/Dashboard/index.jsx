import { useState, useEffect } from "react";
import { AdminBreadcrumb } from "@/components";
import { useAuthContext } from "@/context/useAuthContext";
import { getDemandesDemandeur } from "@/services/demandeService";


const DashboardDemandeur = () => {
  const { user } = useAuthContext();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const demandesData = await getDemandesDemandeur(user.id);
        setDemandes(demandesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) return <div className="flex justify-center items-center h-screen">Chargement du tableau de bord...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">Erreur: {error}</div>;

  const demandesEnCours = demandes.filter(d => d.statut === 'EN_COURS');
  const demandesValidees = demandes.filter(d => d.statut === 'VALIDE');
  const demandesRejetees = demandes.filter(d => d.statut === 'REJETE');

  return (
    <>
      <AdminBreadcrumb title="Tableau de bord" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">Total Demandes</h3>
                <p className="text-3xl font-bold text-primary mt-2">{demandes.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-yellow-600">En cours</h3>
                <p className="text-3xl font-bold text-yellow-500 mt-2">{demandesEnCours.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-green-600">Validées</h3>
                <p className="text-3xl font-bold text-green-500 mt-2">{demandesValidees.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-red-600">Rejetées</h3>
                <p className="text-3xl font-bold text-red-500 mt-2">{demandesRejetees.length}</p>
              </div>
            </div>

            {/* Liste des dernières demandes */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Mes dernières demandes</h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localité</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {demandes.slice(0, 5).map((demande) => (
                        <tr key={demande.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {demande.typeDemande}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(demande.dateCreation).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${demande.statut === 'EN_COURS' ? 'bg-yellow-100 text-yellow-800' :
                                demande.statut === 'VALIDE' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'}`}>
                              {demande.statut}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {demande.localite?.nom || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardDemandeur;