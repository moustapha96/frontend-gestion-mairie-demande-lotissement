
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AgentBreadcrumb } from "@/components";
import { getDemandeurDetails } from "@/services/userService";
import { User, Phone, Mail, MapPin, Briefcase, Calendar, MapPinned, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/utils";

const AgentDemandeurDetails = () => {
    const { id } = useParams();
    const [demandeur, setDemandeur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDemandeur = async () => {
            try {
                const data = await getDemandeurDetails(id);
                setDemandeur(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDemandeur();
    }, [id]);

    // if (loading) return <div className="flex justify-center items-center h-screen">Chargement des détails du Demandeur...</div>;
    // if (error) return <div className="flex justify-center items-center h-screen text-red-600">Erreur: {error}</div>;


    if (loading) return <LoadingSkeleton />
    if (error) return <ErrorDisplay error={error} />


    return (
        <>
            <AgentBreadcrumb title="Détails Demandeur" SubTitle={`${demandeur?.prenom} ${demandeur?.nom}`} />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6 sm:p-10">
                                <h1 className="text-3xl font-bold text-gray-800 mb-6">{`${demandeur.prenom} ${demandeur.nom}`}</h1>
                                <div className="grid gap-8 md:grid-cols-2">
                                    <InfoCard title="Informations Personnelles">
                                        <InfoItem icon={<Calendar className="w-5 h-5" />} label="Date de Naissance" value={new Date(demandeur.dateNaissance).toLocaleDateString()} />
                                        <InfoItem icon={<MapPinned className="w-5 h-5" />} label="Lieu de Naissance" value={demandeur.lieuNaissance} />
                                        <InfoItem icon={<Briefcase className="w-5 h-5" />} label="Numéro Électeur" value={demandeur.numeroElecteur} />
                                    </InfoCard>

                                    <InfoCard title="Contact">
                                        <InfoItem icon={<Phone className="w-5 h-5" />} label="Téléphone" value={demandeur.telephone} />
                                        <InfoItem icon={<Mail className="w-5 h-5" />} label="Email" value={demandeur.email} />
                                        <InfoItem icon={<MapPin className="w-5 h-5" />} label="Adresse" value={demandeur.adresse} />
                                    </InfoCard>
                                </div>

                                {demandeur.demandes && demandeur.demandes.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Demandes Associées</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type de Demande</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Superficie</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Prévu</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Création</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {demandeur.demandes.map((demande) => (
                                                        <tr key={demande.id} className="hover:bg-gray-50 transition duration-300">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{demande.typeDemande}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{demande.superficie} m²</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{demande.usagePrevu}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span

                                                                    className={cn(
                                                                        "text-sm border rounded-md py-1 px-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none",
                                                                        {
                                                                            'bg-yellow-200 border border-yellow-200': demande.statut === 'EN_COURS',
                                                                            'bg-yellow-100 text-yellow-800 border border-yellow-500': demande.statut === 'EN_TRAITEMENT',
                                                                            'bg-green-100 text-green-800 border border-green-500': demande.statut === 'VALIDE',
                                                                            'bg-red-100 text-red-800 border border-red-500': demande.statut === 'REJETE'
                                                                        }
                                                                    )}
                                                                >
                                                                    {demande.statut}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(demande.dateCreation).toLocaleDateString()}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <Link to={`/agent/demandes/${demande.id}/details`} className="text-primary hover:text-blue-900 flex items-center">
                                                                    Détails
                                                                    <ChevronRight className="w-4 h-4 ml-1" />
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

const InfoCard = ({ title, children }) => (
    <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 text-blue-500">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-sm text-gray-800">{value || "N/A"}</p>
        </div>
    </div>
);

function LoadingSkeleton() {
    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="h-9 w-64 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid gap-6 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="flex items-center space-x-3 mt-4">
                                            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

function ErrorDisplay({ error }) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow rounded-lg overflow-hidden w-full max-w-md">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-red-600 mb-4">Erreur</h3>
                    <p className="text-center">{error}</p>
                </div>
            </div>
        </div>
    )
}

export default AgentDemandeurDetails;
