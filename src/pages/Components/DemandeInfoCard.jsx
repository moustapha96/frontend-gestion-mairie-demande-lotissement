import { Award, Calendar, CheckCircle, FileText } from "lucide-react";
import InfoItem from "./InfoItem";

function DemandeInfoCard({ demande }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Informations de la demande</h3>
                <div className="space-y-4">
                    <InfoItem
                        icon={<Calendar className="w-5 h-5" />}
                        label="Date Demande"
                        value={new Date(demande.dateCreation).toLocaleDateString()}
                    />
                    <InfoItem
                        icon={<FileText className="w-5 h-5" />}
                        label="Type de demande"
                        value={demande.typeDemande}
                    />
                    <InfoItem
                        icon={<Award className="w-5 h-5" />}
                        label="Superficie"
                        value={`${demande.superficie} m²`}
                    />
                    <InfoItem
                        icon={<FileText className="w-5 h-5" />}
                        label="Usage prévu"
                        value={demande.usagePrevu}
                    />
                    <InfoItem
                        icon={<FileText className="w-5 h-5" />}
                        label="Document fourni"
                        value={demande.typeDocument}
                    />
                    <InfoItem
                        icon={<FileText className="w-5 h-5" />}
                        label="Autre terrain"
                        value={demande.possedeAutreTerrain ? "Oui" : "Non"}
                    />
                    <InfoItem
                        icon={<CheckCircle className="w-5 h-5" />}
                        label="Statut de la demande"
                        value={
                            <span
                                className={cn(
                                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                    {
                                        'bg-yellow-100 text-yellow-800': demande.statut === 'EN_COURS',
                                        'bg-green-100 text-green-800': demande.statut === 'VALIDE',
                                        'bg-red-100 text-red-800': demande.statut === 'REJETE'
                                    }
                                )}
                            >
                                {demande.statut}
                            </span>
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default DemandeInfoCard
