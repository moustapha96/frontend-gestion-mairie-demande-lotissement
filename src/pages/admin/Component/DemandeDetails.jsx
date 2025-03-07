import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getDemande } from "../../../services/demandeService";
import { Calendar, Award, CheckCircle, Building, Mail, Phone, MapPin, User, FileText, Clock, Link as LinkIcon } from "lucide-react";
import { getFileDocument } from "../../../services/documentService";


const DemandeDetails = () => {
    const { id } = useParams();
    const [demande, setDemande] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fichier, setFichier] = useState(null);

    useEffect(() => {
        const fetchDemande = async () => {
            try {
                const data = await getDemande(id);
                setDemande(data);
                console.log(data.document);
                if (data.document) {
                    const response = await getFileDocument(data.document.id);
                    console.log(response);
                    setFichier(response);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDemande();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen">Chargement des détails de la Demande...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-600">Erreur: {error}</div>;
    if (!demande) return <div className="flex justify-center items-center h-screen text-red-600">Aucune donnée trouvée</div>;

    return (
        <>
            <AdminBreadcrumb title="Détails Demande" SubTitle={demande.intitule} />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6 sm:p-10">
                                <h1 className="text-3xl font-bold text-gray-800 mb-6">{demande.intitule}</h1>
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                                    <InfoCard title="Informations sur la Demande">
                                        <InfoItem icon={<Calendar className="w-5 h-5" />} label="Date de Demande" value={new Date(demande.dateDemande).toLocaleDateString()} />
                                        <InfoItem icon={<Award className="w-5 h-5" />} label="Année d'Obtention" value={demande.anneeObtention} />
                                        <InfoItem icon={<CheckCircle className="w-5 h-5" />} label="Résultat" value={demande.resultat} />
                                    </InfoCard>

                                    <InfoCard title="Institut Associé">
                                        <InfoItem icon={<Building className="w-5 h-5" />} label="Nom" value={demande.institut?.name || demande.nameInstitut} />
                                        <InfoItem icon={<Mail className="w-5 h-5" />} label="Email" value={demande.institut?.email || demande.emailInstitut} />
                                        <InfoItem icon={<Phone className="w-5 h-5" />} label="Téléphone" value={demande.institut?.phone || demande.phoneInstitut} />
                                        <InfoItem icon={<MapPin className="w-5 h-5" />} label="Adresse" value={demande.institut?.adresse || demande.adresseInstitut} />
                                        <InfoItem icon={<MapPin className="w-5 h-5" />} label="Pays" value={demande.institut?.paysResidence || demande.paysInstitut} />
                                    </InfoCard>

                                    <InfoCard title="Information sur le Demandeur">
                                        <InfoItem icon={<User className="w-5 h-5" />} label="Nom" value={demande.demandeur.name} />
                                        <InfoItem icon={<Phone className="w-5 h-5" />} label="Téléphone" value={demande.demandeur.phone} />
                                        <InfoItem icon={<Mail className="w-5 h-5" />} label="Email" value={demande.demandeur.email} />
                                        <InfoItem icon={<MapPin className="w-5 h-5" />} label="Adresse" value={demande.demandeur.adresse} />
                                        <InfoItem icon={<MapPin className="w-5 h-5" />} label="Pays de Résidence" value={demande.demandeur.paysResidence} />
                                    </InfoCard>

                                    {demande.document && (
                                        <InfoCard title="Document">
                                            <InfoItem icon={<FileText className="w-5 h-5" />} label="Type de Document" value={demande.document.typeDocument} />
                                            <InfoItem icon={<Clock className="w-5 h-5" />} label="Date d'Obtention" value={new Date(demande.document.dateObtention).toLocaleDateString()} />
                                            <InfoItem icon={<Award className="w-5 h-5" />} label="Année d'Obtention" value={demande.document.anneeObtention} />
                                            <InfoItem icon={<CheckCircle className="w-5 h-5" />} label="Statut" value={demande.document.statut} />
                                            <InfoItem icon={<FileText className="w-5 h-5" />} label="Code ADN" value={demande.document.codeAdn} />

                                        </InfoCard>
                                    )}
                                </div>
                                <div>
                                    {fichier && (
                                        <>
                                            {fichier && (
                                                <div className="mt-8">
                                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Aperçu du Document</h2>
                                                    <div className="bg-gray-200 rounded-lg p-4">
                                                        <iframe
                                                            src={`data:application/pdf;base64,${fichier}`}
                                                            width="100%"
                                                            height="600px"
                                                            title="Document PDF"
                                                            className="border rounded"
                                                            onLoad={(e) => {
                                                                e.target.contentWindow.document.body.addEventListener('contextmenu', (event) => event.preventDefault());
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
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

export default DemandeDetails;