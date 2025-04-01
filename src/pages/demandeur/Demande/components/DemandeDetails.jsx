"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
    Calendar,
    Award,
    CheckCircle,
    Building,
    Mail,
    Phone,
    MapPin,
    User,
    Briefcase,
    Globe,
    FileText,
    Clock,
    MapPinCheck,
    AlertTriangle
} from "lucide-react"
import { getDemandeDetails, getFileDocument } from "@/services/demandeService"
import { useAuthContext } from "@/context"
import { DemandeurBreadcrumb } from "@/components"
import { cn } from "@/utils"
import MapCar from "@/pages/admin/Map/MapCar"
import { formatCoordinates, formatPhoneNumber, formatPrice } from "@/utils/formatters"

export default function DemandeurDemandeDetails() {
    const { user } = useAuthContext();
    const { id } = useParams()
    const [demande, setDemande] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [fichier, setFichier] = useState(null)

    const [rectoFile, setRectoFile] = useState(null)
    const [versoFile, setVersoFile] = useState(null)

    useEffect(() => {
        const fetchDemande = async () => {
            try {
                const data = await getDemandeDetails(id)
                setDemande(data)
                console.log(data)
                if (data.document) {
                    const response = await getFileDocument(id)
                    setRectoFile(response['recto'])
                    setVersoFile(response['verso'])
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchDemande()
    }, [id])

    if (loading) return <LoadingSkeleton />
    if (error) return <ErrorDisplay error={error} />

    return (
        <>
            <DemandeurBreadcrumb title="Details de la demande" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <div className="bg-gray-100 min-h-screen pb-10">
                                <header className="bg-white shadow">
                                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                        <h1 className="text-3xl font-bold text-gray-900">{"Detail de la demande"}</h1>
                                    </div>
                                </header>
                                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                                    <div className="px-4 py-6 sm:px-0">


                                        <div className="grid gap-6 md:grid-cols-2">
                                            <DemandeInfoCard demande={demande} />

                                            {/* <DemandeurInfoCard demandeur={demande.demandeur} /> */}
                                            <LocaliteInfoCard localite={demande.localite} />
                                            {demande.documentGenerer && demande.documentGenerer.isGenerated && (
                                                <DocumentGenereInfoCard documentGenerer={demande.documentGenerer} />
                                            )}
                                        </div>
                                        <div className="grid gap-6 md:grid-cols-1  mt-8">
                                            {demande.statut === "REJETE" && (
                                                <DemandeRefusInfoCard demande={demande} />
                                            )}
                                        </div>

                                        {demande.localite && demande.localite.longitude && demande.localite.latitude && (

                                            <div className="grid gap-6 md:grid-cols-1 mt-8">
                                                <DemandeInfoCarteCard localite={demande.localite} />
                                            </div>
                                        )}

                                    </div>

                                    {
                                        (rectoFile || versoFile) && (
                                            <div className="mt-8">
                                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Documents fournis</h2>
                                                <div className="grid gap-6 md:grid-cols-2">
                                                    {rectoFile && <FilePreview file={rectoFile} title="Recto du document" />}
                                                    {versoFile && <FilePreview file={versoFile} title="Verso du document" />}
                                                </div>
                                            </div>
                                        )
                                    }

                                </main>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}


function DemandeInfoCard({ demande }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
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

function DemandeInfoCarteCard({ localite }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Visualtion sur la carte</h3>
                <div className="space-y-4">

                    <InfoItem
                        icon={<MapPinCheck className="w-5 h-5" />}
                        label={"Coordonnées"}
                        value={formatCoordinates(localite.latitude, localite.longitude)}
                    />
                    {localite.longitude && localite.latitude && <MapCar selectedItem={localite} type="localite" />}
                </div>
            </div>
        </div>
    );
}

function DemandeRefusInfoCard({ demande }) {


    return (
        <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary border-l-4 border-red-500">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium leading-6 text-red-700 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Motif du rejet de la demande
                    </h3>

                </div>

                <div className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
                    {demande.motif_refus || "Aucun motif spécifié"}
                </div>
            </div>
        </div>
    )
}

// Mise à jour de DemandeurInfoCard
function DemandeurInfoCard({ demandeur }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Informations du demandeur</h3>
                <div className="space-y-4">
                    <InfoItem
                        icon={<User className="w-5 h-5" />}
                        label="Nom complet"
                        value={`${demandeur.prenom} ${demandeur.nom}`}
                    />
                    <InfoItem
                        icon={<Mail className="w-5 h-5" />}
                        label="Email"
                        value={demandeur.email}
                    />
                    <InfoItem
                        icon={<Phone className="w-5 h-5" />}
                        label="Téléphone"
                        value={formatPhoneNumber(demandeur.telephone)}
                    />
                    <InfoItem
                        icon={<MapPin className="w-5 h-5" />}
                        label="Adresse"
                        value={demandeur.adresse}
                    />
                    <InfoItem
                        icon={<Calendar className="w-5 h-5" />}
                        label="Date de Naissance"
                        value={new Date(demandeur.dateNaissance).toLocaleDateString()}
                    />
                    <InfoItem
                        icon={<MapPin className="w-5 h-5" />}
                        label="Lieu de Naissance"
                        value={demandeur.lieuNaissance}
                    />
                    <InfoItem
                        icon={<FileText className="w-5 h-5" />}
                        label="Numéro électeur"
                        value={demandeur.numeroElecteur}
                    />
                    <InfoItem
                        icon={<Briefcase className="w-5 h-5" />}
                        label="Profession"
                        value={demandeur.profession}
                    />
                </div>
            </div>
        </div>
    );
}

function LocaliteInfoCard({ localite, demande }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{"Informations sur a localité"}</h3>
                <div className="space-y-4">
                    <InfoItem icon={<Building className="w-5 h-5" />} label={"Nom"} value={localite.nom} />
                    <InfoItem icon={<Globe className="w-5 h-5" />} label={"Prix"} value={formatPrice(localite.prix)} />
                    <InfoItem
                        icon={<FileText className="w-5 h-5" />}
                        label={"Description"}
                        value={localite.description}
                    />
                    <InfoItem
                        icon={<MapPinCheck className="w-5 h-5" />}
                        label={"Coordonnées"}
                        value={formatCoordinates(localite.latitude, localite.longitude)}
                    />

                </div>
            </div>
        </div>
    )
}

function DocumentInfoCard({ document }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{"Document"}</h3>
                <div className="space-y-4">
                    <InfoItem icon={<FileText className="w-5 h-5" />} label={"Type document"} value={document.type} />
                    <InfoItem icon={<FileText className="w-5 h-5" />} label={"Date de renseignement"} value={document.date} />
                </div>
            </div>
        </div>
    )
}

// Ajout du nouveau composant pour le document généré
function DocumentGenereInfoCard({ documentGenerer }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Document généré</h3>
                <div className="space-y-4">
                    <InfoItem
                        icon={<FileText className="w-5 h-5" />}
                        label="Type"
                        value={documentGenerer.type}
                    />
                    <InfoItem
                        icon={<Calendar className="w-5 h-5" />}
                        label="Date de création"
                        value={new Date(documentGenerer.dateCreation).toLocaleDateString()}
                    />
                    {documentGenerer.contenu && (
                        <>
                            <InfoItem
                                icon={<FileText className="w-5 h-5" />}
                                label="Numéro de permis"
                                value={documentGenerer.contenu.numeroPermis}
                            />
                            <InfoItem
                                icon={<Calendar className="w-5 h-5" />}
                                label="Date de délivrance"
                                value={documentGenerer.contenu.dateDelivrance}
                            />
                            <InfoItem
                                icon={<Clock className="w-5 h-5" />}
                                label="Durée de validité"
                                value={documentGenerer.contenu.dureeValidite}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 text-gray-400">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-1 text-sm text-gray-900">{value || "N/A"}</p>
            </div>
        </div>
    )
}

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
                            <div key={i} className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
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
            <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary w-full max-w-md">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-red-600 mb-4">Erreur</h3>
                    <p className="text-center">{error}</p>
                </div>
            </div>
        </div>
    )
}

function FilePreview({ file, title }) {
    const fileType = file.startsWith('/9j/') ? 'image/jpeg'
        : file.startsWith('iVBORw0KGgo') ? 'image/png'
            : 'application/pdf'

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
                <div className="bg-gray-200 rounded-lg p-4">
                    {fileType.startsWith('image/') ? (
                        <img
                            src={`data:${fileType};base64,${file}`}
                            alt={title}
                            className="w-full h-auto max-h-[400px] object-contain"
                        />
                    ) : (
                        <iframe
                            src={`data:application/pdf;base64,${file}`}
                            title={title}
                            className="w-full h-[400px]"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

// Utilisation
