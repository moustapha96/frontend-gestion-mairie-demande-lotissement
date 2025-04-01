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
    MapPinCheck,
    AlertTriangle,
} from "lucide-react"
import { getDemandeDetails, getFileDocument, updateDemandeRefus } from "@/services/demandeService"
import { useAuthContext } from "@/context"
import { AdminBreadcrumb } from "@/components"
import { cn } from "@/utils"
import { FaMarker } from "react-icons/fa"
import MapCar from "../../../admin/Map/MapCar";
import { formatCoordinates, formatPhoneNumber, formatPrice } from "@/utils/formatters"
import { Button, Descriptions, Modal, Popover, Space, Tooltip, message } from "antd"
import { EditOutlined, EnvironmentOutlined, InfoCircleOutlined, PaperClipOutlined, SaveOutlined, UserAddOutlined } from "@ant-design/icons"
import { getDetaitHabitant } from "../../../../services/userService"
import TextArea from "antd/es/input/TextArea"

export default function AdminDemandeDetails() {
    const { id } = useParams()
    const [demande, setDemande] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    // Remplacer l'état fichier existant par :
    const [rectoFile, setRectoFile] = useState(null)
    const [versoFile, setVersoFile] = useState(null)


    useEffect(() => {
        const fetchDemande = async () => {
            try {
                const data = await getDemandeDetails(id)
                console.log("data", data)
                console.log("data isHabitant", data.demandeur.isHabitant)
                setDemande(data)
                if (data.document) {
                    const response = await getFileDocument(id)
                    // setFichier(response)
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

    const handleMotifRefusUpdate = async (newMotif) => {
        try {
            await updateDemandeRefus(id, newMotif);
            setDemande(prev => ({
                ...prev,
                motif_refus: newMotif
            }));
            message.success("Motif de rejet mis à jour avec succès");
        } catch (error) {
            message.error("Erreur lors de la mise à jour du motif de rejet");
            console.error("Erreur:", error);
        }
    };


    if (loading) return <LoadingSkeleton />
    if (error) return <ErrorDisplay error={error} />

    return (
        <>
            <AdminBreadcrumb title="Details de la demande" />
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
                                            <DemandeurInfoCard demandeur={demande.demandeur} />
                                            <LocaliteInfoCard localite={demande.localite} demande={demande} />
                                            {demande.documentGenerer && demande.documentGenerer.isGenerated && <>
                                                <DocumentInfoCard document={demande.documentGenerer} />
                                            </>}


                                        </div>

                                        <div className="grid gap-6 md:grid-cols-1  mt-8">
                                            {demande.statut === "REJETE" && (
                                                <DemandeRefusInfoCard demande={demande} onMotifUpdate={handleMotifRefusUpdate} />
                                            )}
                                        </div>
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
        <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary  border-l-4 border-primary">
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
                                        'bg-yellow-200 border border-yellow-200': demande.statut === 'EN_COURS',
                                        'bg-yellow-100 text-yellow-800 border border-yellow-500': demande.statut === 'EN_TRAITEMENT',
                                        'bg-green-100 text-green-800 border border-green-500': demande.statut === 'VALIDE',
                                        'bg-red-100 text-red-800 border border-red-500': demande.statut === 'REJETE'
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

function DemandeRefusInfoCard({ demande, onMotifUpdate }) {
    const [isEditing, setIsEditing] = useState(false)
    const [motif, setMotif] = useState(demande.motif_refus || "")
    const [saving, setSaving] = useState(false)
    const { user } = useAuthContext()

    // Vérifier si l'utilisateur a les droits d'édition (admin ou super admin)
    const canEdit = user && (user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_SUPER_ADMIN"))

    const handleSave = async () => {
        if (!motif.trim()) {
            message.error("Le motif de rejet ne peut pas être vide")
            return
        }

        setSaving(true)
        try {
            await onMotifUpdate(motif)
            setIsEditing(false)
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden  border-primary border-l-4 ">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium leading-6 text-red-700 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Motif du rejet de la demande
                    </h3>
                    {canEdit && !isEditing && (
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => setIsEditing(true)}
                            className="text-primary hover:text-primary-dark"
                        >
                            Modifier
                        </Button>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-4">
                        <TextArea
                            value={motif}
                            onChange={(e) => setMotif(e.target.value)}
                            rows={4}
                            placeholder="Saisissez le motif du rejet"
                            className="w-full"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                onClick={() => {
                                    setIsEditing(false)
                                    setMotif(demande.motif_refus || "")
                                }}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSave}
                                loading={saving}
                                className="bg-primary hover:bg-primary-dark text-white"
                                disabled={!canEdit}
                            >
                                Enregistrer
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
                        {demande.motif_refus || "Aucun motif spécifié"}
                    </div>
                )}
            </div>
        </div>
    )
}

function DemandeurInfoCard({ demandeur }) {
    const [loadingHabitant, setLoadingHabitant] = useState(false)
    const [habitantData, setHabitantData] = useState(null)

    useEffect(() => {
        fetchHabitantInfo()
    }, [demandeur])

    const renderHabitantContent = () => {
        const data = habitantData

        if (!data) {
            return <div>Chargement des informations...</div>
        }

        return (
            <div className="max-w-3xl">
                <div className="grid grid-cols-3 gap-2">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="border-b pb-1">
                            <strong>{key}:</strong> {value || "-"}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const fetchHabitantInfo = async () => {
        setLoadingHabitant(true)
        try {
            const habitantInfo = await getDetaitHabitant(demandeur.id)
            console.log("habitante", habitantInfo)
            setHabitantData(habitantInfo)
        } catch (error) {
            console.error("Erreur lors de la récupération des informations du habitant:", error)
        } finally {
            setLoadingHabitant(false)
        }
    }

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
                    <InfoItem icon={<Mail className="w-5 h-5" />} label="Email" value={demandeur.email} />
                    <InfoItem
                        icon={<Phone className="w-5 h-5" />}
                        label="Téléphone"
                        value={formatPhoneNumber(demandeur.telephone)}
                    />
                    <InfoItem icon={<MapPin className="w-5 h-5" />} label="Adresse" value={demandeur.adresse} />
                    <InfoItem
                        icon={<Calendar className="w-5 h-5" />}
                        label="Date de Naissance"
                        value={new Date(demandeur.dateNaissance).toLocaleDateString()}
                    />
                    <InfoItem icon={<MapPin className="w-5 h-5" />} label="Lieu de Naissance" value={demandeur.lieuNaissance} />
                    <InfoItem icon={<FileText className="w-5 h-5" />} label="Numéro électeur" value={demandeur.numeroElecteur} />
                    <InfoItem icon={<Briefcase className="w-5 h-5" />} label="Profession" value={demandeur.profession} />

                    <InfoItem
                        icon={<UserAddOutlined className="w-5 h-5" />}
                        label="Habitant"
                        value={demandeur.isHabitant ? 'Oui' : 'Non'}
                    />

                    {demandeur.isHabitant && (
                        <Space>
                            <span>Informations détaillées:</span>
                            <Popover
                                content={renderHabitantContent()}
                                title="Informations détaillées"
                                trigger="click"
                                placement="right"
                                overlayStyle={{ maxWidth: "800px" }}
                                onVisibleChange={(visible) => {
                                    if (visible) {
                                        fetchHabitantInfo()
                                    }
                                }}
                            >
                                <Button type="text" icon={<InfoCircleOutlined />} className="text-primary" loading={loadingHabitant} />
                            </Popover>
                        </Space>
                    )}
                </div>
            </div>
        </div>
    )
}


function LocaliteInfoCard({ localite, demande }) {

    const [isMapModalVisible, setIsMapModalVisible] = useState(false);

    const hasValidCoordinates =
        localite &&
        localite.latitude &&
        localite.longitude &&
        !isNaN(Number.parseFloat(localite.latitude)) &&
        !isNaN(Number.parseFloat(localite.longitude))

    if (!localite) {
        return (
            <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Informations sur la localité</h3>
                    <p className="text-sm text-gray-500">Aucune localité associée à cette demande</p>
                </div>
            </div>
        )
    }

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
                    {hasValidCoordinates && (
                        <InfoItemCoordonnee
                            icon={<MapPinCheck className="w-5 h-5" />}
                            label="Coordonnées"
                            value={formatCoordinates(localite.latitude, localite.longitude)}
                            latitude={localite.latitude}
                            longitude={localite.longitude}
                            setIsMapModalVisible={setIsMapModalVisible}
                            isMapModalVisible={isMapModalVisible}
                        />
                    )}

                </div>
            </div>

            <Modal
                title="Carte de la Localité"
                open={isMapModalVisible}
                onCancel={() => setIsMapModalVisible(false)}
                width={1000}
                footer={null}
            >
                {hasValidCoordinates && (
                    <MapCar latitude={localite.latitude} longitude={localite.longitude} selectedItem={localite} type="localite" />
                )}
            </Modal>
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
function InfoItemCoordonnee({ icon, label, value, latitude, longitude, setIsMapModalVisible, isMapModalVisible }) {
    // Vérifier que les coordonnées sont valides avant d'activer le bouton
    const hasValidCoordinates =
        latitude && longitude && !isNaN(Number.parseFloat(latitude)) && !isNaN(Number.parseFloat(longitude))

    return (
        <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 text-gray-400">{icon}</div>
            <div className="flex-grow">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-1 text-sm text-gray-900">{value || "N/A"}</p>
            </div>
            {hasValidCoordinates && (
                <Tooltip title="Voir sur la carte">
                    <Button type="text" icon={<EnvironmentOutlined />} onClick={() => setIsMapModalVisible(!isMapModalVisible)} />
                </Tooltip>
            )}
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

