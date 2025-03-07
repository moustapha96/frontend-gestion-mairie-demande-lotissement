
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getDemandeur } from "../../../services/demandeurService";
import { User, Phone, Mail, MapPin, Briefcase, Calendar, MapPinned, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";

const DemandeurDetails = () => {
    const { id } = useParams();
    const [demandeur, setDemandeur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDemandeur = async () => {
            try {
                const data = await getDemandeur(id);
                setDemandeur(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDemandeur();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen">Chargement des détails du Demandeur...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-600">Erreur: {error}</div>;

    return (
        <>
            <AdminBreadcrumb title="Détails Demandeur" SubTitle={demandeur?.name} />
            <section >
                <div className="container">
                    <div className="my-6 space-y-6">


                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6 sm:p-10">
                                <h1 className="text-3xl font-bold text-gray-800 mb-6">{demandeur.name}</h1>
                                <div className="grid gap-8 md:grid-cols-2">
                                    <InfoCard title="Informations Personnelles">
                                        <InfoItem icon={<User className="w-5 h-5" />} label="Intitulé" value={demandeur.intitule} />
                                        <InfoItem icon={<Calendar className="w-5 h-5" />} label="Date de Naissance" value={new Date(demandeur.dateNaissance).toLocaleDateString()} />
                                        <InfoItem icon={<MapPinned className="w-5 h-5" />} label="Lieu de Naissance" value={demandeur.lieuNaissance} />
                                        <InfoItem icon={<Briefcase className="w-5 h-5" />} label="Profession" value={demandeur.profession} />
                                        <InfoItem icon={<User className="w-5 h-5" />} label="Sexe" value={demandeur.sexe} />
                                    </InfoCard>

                                    <InfoCard title="Contact">
                                        <InfoItem icon={<Phone className="w-5 h-5" />} label="Téléphone" value={demandeur.phone} />
                                        <InfoItem icon={<Mail className="w-5 h-5" />} label="Email" value={demandeur.email} />
                                        <InfoItem icon={<MapPin className="w-5 h-5" />} label="Adresse" value={demandeur.adresse} />
                                        <InfoItem icon={<MapPin className="w-5 h-5" />} label="Pays de Résidence" value={demandeur.paysResidence} />
                                    </InfoCard>
                                </div>

                                {demandeur.demandes && demandeur.demandes.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Demandes Associées</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intitulé</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Demande</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résultat</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {demandeur.demandes.map((demande) => (
                                                        <tr key={demande.id} className="hover:bg-gray-50 transition duration-300">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{demande.intitule}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(demande.dateDemande).toLocaleDateString()}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${demande.resultat === "Accepted" ? "bg-green-100 text-green-800" :
                                                                    demande.resultat === "Declined" ? "bg-red-100 text-red-800" :
                                                                        "bg-yellow-100 text-yellow-800"
                                                                    }`}>
                                                                    {demande.resultat === "Accepted" && <CheckCircle className="w-4 h-4 mr-1" />}
                                                                    {demande.resultat === "Declined" && <XCircle className="w-4 h-4 mr-1" />}
                                                                    {demande.resultat === "Pending" && <Clock className="w-4 h-4 mr-1" />}
                                                                    {demande.resultat}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <Link to={`/admin/demandes/${demande.id}/details`} className="text-blue-600 hover:text-blue-900 flex items-center">
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

export default DemandeurDetails;