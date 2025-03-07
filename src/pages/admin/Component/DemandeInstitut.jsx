

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getInstitut } from "../../../services/institutService";
import { Search, Download, Eye, ChevronDown } from "lucide-react";
import { cn } from "@/utils";

const DemandeInstitut = () => {
    const { id } = useParams();
    const [institut, setInstitut] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [demandes, setDemandes] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const fetchDemande = async () => {
            try {
                const data = await getInstitut(id);
                console.log(data)
                setInstitut(data);
                setDemandes(data.demandes);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDemande();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen">Chargement des détails de l'institut...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-600">Erreur: {error}</div>;

    const filteredDemandes = demandes.filter(demande =>
        demande.intitule.toLowerCase().includes(filter.toLowerCase()) ||
        demande.demandeur.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <>


            <AdminBreadcrumb title="Demandes Institut" SubTitle={institut?.type + "  " + institut?.name} />

            <section >
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6 sm:p-10">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold text-gray-800">Liste des Demandes</h1>

                                </div>

                                <div className="mb-6">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Rechercher par intitulé ou demandeur..."
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {["#", "Intitulé", "Demandeur", "Date de Demande", "Résultat", "Actions"].map((header) => (
                                                    <th
                                                        key={header}
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        {header}
                                                        <ChevronDown className="w-4 h-4 inline-block ml-1" />
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredDemandes.map((demande) => (
                                                <tr key={demande.id} className="hover:bg-gray-50 transition duration-300">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{demande.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{demande.intitule}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{demande.demandeur.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(demande.dateDemande).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={cn(
                                                                "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                                                demande.resultat === "Accepted" ? "bg-green-100 text-green-800" :
                                                                    demande.resultat === "Declined" ? "bg-red-100 text-red-800" :
                                                                        demande.resultat === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                                                            "bg-gray-100 text-gray-800"
                                                            )}
                                                        >
                                                            {demande.resultat}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {demande && demande.document && <>
                                                            <Link
                                                                to={`/admin/documents/${demande.document.id}/details`}
                                                                className="text-blue-600 hover:text-blue-900 flex items-center"
                                                            >
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                Détails
                                                            </Link>
                                                        </>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div >
            </section>
        </>
    );
};

export default DemandeInstitut;