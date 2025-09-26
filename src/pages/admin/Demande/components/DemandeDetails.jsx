// "use client"

// import { useContext, useEffect, useState } from "react"
// import { useParams } from "react-router-dom"
// import {
//     Calendar,
//     Award,
//     CheckCircle,
//     Building,
//     Mail,
//     Phone,
//     MapPin,
//     User,
//     Briefcase,
//     Globe,
//     FileText,
//     MapPinCheck,
//     AlertTriangle,
// } from "lucide-react"
// import { getDemandeDetails, getFileDocument, updateDemandeRefus } from "@/services/demandeService"
// import { useAuthContext } from "@/context"
// import { AdminBreadcrumb } from "@/components"
// import { cn } from "@/utils"
// import { FaMarker } from "react-icons/fa"
// import MapCar from "../../../admin/Map/MapCar";
// import { formatCoordinates, formatPhoneNumber, formatPrice } from "@/utils/formatters"
// import { Button, Descriptions, Modal, Popover, Space, Tooltip, message } from "antd"
// import { EditOutlined, EnvironmentOutlined, InfoCircleOutlined, PaperClipOutlined, SaveOutlined, UserAddOutlined } from "@ant-design/icons"
// import { getDetaitHabitant } from "../../../../services/userService"
// import TextArea from "antd/es/input/TextArea"
// import { AppContext } from "@/AppContext"

// export default function AdminDemandeDetails() {
//     const { id } = useParams()
//     const [demande, setDemande] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)
//     // Remplacer l'état fichier existant par :
//     const [rectoFile, setRectoFile] = useState(null)
//     const [versoFile, setVersoFile] = useState(null)


//     useEffect(() => {
//         const fetchDemande = async () => {
//             try {
//                 const data = await getDemandeDetails(id)
//                 console.log("data", data)
//                 // console.log("data", data)
//                 // console.log("data isHabitant", data.demandeur.isHabitant)
//                 setDemande(data)
//                 if (data.document) {
//                     const response = await getFileDocument(id)
//                     // setFichier(response)
//                     setRectoFile(response['recto'])
//                     setVersoFile(response['verso'])
//                 }
//             } catch (err) {
//                 setError(err.message)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchDemande()
//     }, [id])


//     const handleDeleteDocument = async () => {
//         if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.")) {
//             return;
//         }
//         setDeleting(true);
//         try {
//             await deleteDocumentGenerer(demande.id);
//             message.success("Document supprimé avec succès");
//             if (onDocumentDeleted) {
//                 onDocumentDeleted();
//             }
//         } catch (error) {
//             message.error("Erreur lors de la suppression du document");
//             console.error("Erreur:", error);
//         } finally {
//             setDeleting(false);
//         }
//     };

//     const handleMotifRefusUpdate = async (newMotif) => {
//         try {
//             await updateDemandeRefus(id, newMotif);
//             setDemande(prev => ({
//                 ...prev,
//                 motif_refus: newMotif
//             }));
//             message.success("Motif de rejet mis à jour avec succès");
//         } catch (error) {
//             message.error("Erreur lors de la mise à jour du motif de rejet");
//             console.error("Erreur:", error);
//         }
//     };


//     if (loading) return <LoadingSkeleton />
//     if (error) return <ErrorDisplay error={error} />

//     return (
//         <>
//             <AdminBreadcrumb title="Details de la demande" />
//             <section>
//                 <div className="container">
//                     <div className="my-6 space-y-6">
//                         <div className="grid grid-cols-1">
//                             <div className="bg-gray-100 min-h-screen pb-10">
//                                 <header className="bg-white shadow">
//                                     <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//                                         <h1 className="text-3xl font-bold text-gray-900">{"Detail de la demande"}</h1>
//                                     </div>
//                                 </header>
//                                 <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//                                     <div className="px-4 py-6 sm:px-0">
//                                         <div className="grid gap-6 md:grid-cols-2">
//                                             <DemandeInfoCard demande={demande} />
//                                             <DemandeurInfoCard demandeur={demande.demandeur} />
//                                             <LocaliteInfoCard localite={demande.localite} demande={demande} />

//                                             {demande.documentGenerer && demande.documentGenerer.isGenerated && (
//                                                 <DocumentGenereInfoCard documentGenerer={demande.documentGenerer} />
//                                             )}

//                                         </div>

//                                         <div className="grid gap-6 md:grid-cols-1  mt-8">
//                                             {demande.statut === "REJETE" && (
//                                                 <DemandeRefusInfoCard demande={demande} onMotifUpdate={handleMotifRefusUpdate} />
//                                             )}
//                                         </div>


//                                     </div>


//                                     {
//                                         (rectoFile || versoFile) && (
//                                             <div className="mt-8">
//                                                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Documents fournis</h2>
//                                                 <div className="grid gap-6 md:grid-cols-2">
//                                                     {rectoFile && <FilePreview file={rectoFile} title="Recto du document" />}
//                                                     {versoFile && <FilePreview file={versoFile} title="Verso du document" />}
//                                                 </div>
//                                             </div>
//                                         )
//                                     }
//                                 </main>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//         </>
//     )
// }

// function DemandeInfoCard({ demande }) {
//     return (
//         <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary  border-l-4 border-primary">
//             <div className="px-4 py-5 sm:p-6">
//                 <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Informations de la demande</h3>
//                 <div className="space-y-4">
//                     <InfoItem
//                         icon={<Calendar className="w-5 h-5" />}
//                         label="Date Demande"
//                         value={new Date(demande.dateCreation).toLocaleDateString()}
//                     />
//                     <InfoItem
//                         icon={<FileText className="w-5 h-5" />}
//                         label="Type de demande"
//                         value={demande.typeDemande}
//                     />
//                     <InfoItem
//                         icon={<Award className="w-5 h-5" />}
//                         label="Superficie"
//                         value={`${demande.superficie} m²`}
//                     />
//                     <InfoItem
//                         icon={<FileText className="w-5 h-5" />}
//                         label="Usage prévu"
//                         value={demande.usagePrevu}
//                     />
//                     <InfoItem
//                         icon={<FileText className="w-5 h-5" />}
//                         label="Document fourni"
//                         value={demande.typeDocument}
//                     />
//                     <InfoItem
//                         icon={<FileText className="w-5 h-5" />}
//                         label="Autre terrain"
//                         value={demande.possedeAutreTerrain ? "Oui" : "Non"}
//                     />
//                     <InfoItem
//                         icon={<CheckCircle className="w-5 h-5" />}
//                         label="Statut de la demande"
//                         value={
//                             <span
//                                 className={cn(
//                                     "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
//                                     {
//                                         'bg-yellow-200 border border-yellow-200': demande.statut === 'EN_COURS',
//                                         'bg-yellow-100 text-yellow-800 border border-yellow-500': demande.statut === 'EN_TRAITEMENT',
//                                         'bg-green-100 text-green-800 border border-green-500': demande.statut === 'VALIDE',
//                                         'bg-red-100 text-red-800 border border-red-500': demande.statut === 'REJETE'
//                                     }
//                                 )}

//                             >
//                                 {demande.statut}
//                             </span>
//                         }
//                     />

//                 </div>
//             </div>
//         </div>
//     );
// }

// function DemandeRefusInfoCard({ demande, onMotifUpdate }) {
//     const [isEditing, setIsEditing] = useState(false)
//     const [motif, setMotif] = useState(demande.motif_refus || "")
//     const [saving, setSaving] = useState(false)
//     const { user } = useAuthContext()

//     // Vérifier si l'utilisateur a les droits d'édition (admin ou super admin)
//     const canEdit = user && (user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_SUPER_ADMIN"))

//     const handleSave = async () => {
//         if (!motif.trim()) {
//             message.error("Le motif de rejet ne peut pas être vide")
//             return
//         }

//         setSaving(true)
//         try {
//             await onMotifUpdate(motif)
//             setIsEditing(false)
//         } catch (error) {
//             console.error("Erreur lors de la sauvegarde:", error)
//         } finally {
//             setSaving(false)
//         }
//     }

//     return (
//         <div className="bg-white shadow rounded-lg overflow-hidden  border-primary border-l-4 ">
//             <div className="px-4 py-5 sm:p-6">
//                 <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-medium leading-6 text-red-700 flex items-center">
//                         <AlertTriangle className="w-5 h-5 mr-2" />
//                         Motif du rejet de la demande
//                     </h3>
//                     {canEdit && !isEditing && (
//                         <Button
//                             type="text"
//                             icon={<EditOutlined />}
//                             onClick={() => setIsEditing(true)}
//                             className="text-primary hover:text-primary-dark"
//                         >
//                             Modifier
//                         </Button>
//                     )}
//                 </div>

//                 {isEditing ? (
//                     <div className="space-y-4">
//                         <TextArea
//                             value={motif}
//                             onChange={(e) => setMotif(e.target.value)}
//                             rows={4}
//                             placeholder="Saisissez le motif du rejet"
//                             className="w-full"
//                         />
//                         <div className="flex justify-end space-x-2">
//                             <Button
//                                 onClick={() => {
//                                     setIsEditing(false)
//                                     setMotif(demande.motif_refus || "")
//                                 }}
//                             >
//                                 Annuler
//                             </Button>
//                             <Button
//                                 className="ant-btn-primary"
//                                 icon={<SaveOutlined />}
//                                 onClick={handleSave}
//                                 loading={saving}
//                                 className="bg-primary hover:bg-primary-dark text-white"
//                                 disabled={!canEdit}
//                             >
//                                 Enregistrer
//                             </Button>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
//                         {demande.motif_refus || "Aucun motif spécifié"}
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// function DemandeurInfoCard({ demandeur }) {
//     const [loadingHabitant, setLoadingHabitant] = useState(false)
//     const [habitantData, setHabitantData] = useState(null)

//     useEffect(() => {
//         fetchHabitantInfo()
//     }, [demandeur])

//     const renderHabitantContent = () => {
//         const data = habitantData

//         if (!data) {
//             return <div>Chargement des informations...</div>
//         }

//         return (
//             <div className="max-w-3xl">
//                 <div className="grid grid-cols-3 gap-2">
//                     {Object.entries(data).map(([key, value]) => (
//                         <div key={key} className="border-b pb-1">
//                             <strong>{key}:</strong> {value || "-"}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         )
//     }

//     const fetchHabitantInfo = async () => {
//         setLoadingHabitant(true)
//         try {
//             const habitantInfo = await getDetaitHabitant(demandeur.id)
//             console.log("habitante", habitantInfo)
//             setHabitantData(habitantInfo)
//         } catch (error) {
//             console.error("Erreur lors de la récupération des informations du habitant:", error)
//         } finally {
//             setLoadingHabitant(false)
//         }
//     }

//     return (
//         <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
//             <div className="px-4 py-5 sm:p-6">
//                 <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Informations du demandeur</h3>
//                 <div className="space-y-4">
//                     <InfoItem
//                         icon={<User className="w-5 h-5" />}
//                         label="Nom complet"
//                         value={`${demandeur.prenom} ${demandeur.nom}`}
//                     />
//                     <InfoItem icon={<Mail className="w-5 h-5" />} label="Email" value={demandeur.email} />
//                     <InfoItem
//                         icon={<Phone className="w-5 h-5" />}
//                         label="Téléphone"
//                         value={formatPhoneNumber(demandeur.telephone)}
//                     />
//                     <InfoItem icon={<MapPin className="w-5 h-5" />} label="Adresse" value={demandeur.adresse} />
//                     <InfoItem
//                         icon={<Calendar className="w-5 h-5" />}
//                         label="Date de Naissance"
//                         value={new Date(demandeur.dateNaissance).toLocaleDateString()}
//                     />
//                     <InfoItem icon={<MapPin className="w-5 h-5" />} label="Lieu de Naissance" value={demandeur.lieuNaissance} />
//                     <InfoItem icon={<FileText className="w-5 h-5" />} label="Numéro électeur" value={demandeur.numeroElecteur} />
//                     <InfoItem icon={<Briefcase className="w-5 h-5" />} label="Profession" value={demandeur.profession} />

//                     <InfoItem
//                         icon={<UserAddOutlined className="w-5 h-5" />}
//                         label="Habitant"
//                         value={demandeur.isHabitant ? 'Oui' : 'Non'}
//                     />

//                     {demandeur.isHabitant && (
//                         <Space>
//                             <span>Informations détaillées:</span>
//                             <Popover
//                                 content={renderHabitantContent()}
//                                 title="Informations détaillées"
//                                 trigger="click"
//                                 placement="right"
//                                 overlayStyle={{ maxWidth: "800px" }}
//                                 onVisibleChange={(visible) => {
//                                     if (visible) {
//                                         fetchHabitantInfo()
//                                     }
//                                 }}
//                             >
//                                 <Button type="text" icon={<InfoCircleOutlined />} className="text-primary" loading={loadingHabitant} />
//                             </Popover>
//                         </Space>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }


// function LocaliteInfoCard({ localite, demande }) {

//     const [isMapModalVisible, setIsMapModalVisible] = useState(false);

//     const hasValidCoordinates =
//         localite &&
//         localite.latitude &&
//         localite.longitude &&
//         !isNaN(Number.parseFloat(localite.latitude)) &&
//         !isNaN(Number.parseFloat(localite.longitude))

//     if (!localite) {
//         return (
//             <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
//                 <div className="px-4 py-5 sm:p-6">
//                     <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Informations sur la localité</h3>
//                     <p className="text-sm text-gray-500">Aucune localité associée à cette demande</p>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
//             <div className="px-4 py-5 sm:p-6">
//                 <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{"Informations sur a localité"}</h3>
//                 <div className="space-y-4">
//                     <InfoItem icon={<Building className="w-5 h-5" />} label={"Nom"} value={localite.nom} />
//                     <InfoItem icon={<Globe className="w-5 h-5" />} label={"Prix"} value={formatPrice(localite.prix)} />
//                     <InfoItem
//                         icon={<FileText className="w-5 h-5" />}
//                         label={"Description"}
//                         value={localite.description}
//                     />
//                     {hasValidCoordinates && (
//                         <InfoItemCoordonnee
//                             icon={<MapPinCheck className="w-5 h-5" />}
//                             label="Coordonnées"
//                             value={formatCoordinates(localite.latitude, localite.longitude)}
//                             latitude={localite.latitude}
//                             longitude={localite.longitude}
//                             setIsMapModalVisible={setIsMapModalVisible}
//                             isMapModalVisible={isMapModalVisible}
//                         />
//                     )}

//                 </div>
//             </div>

//             <Modal
//                 title="Carte de la Localité"
//                 open={isMapModalVisible}
//                 onCancel={() => setIsMapModalVisible(false)}
//                 width={1000}
//                 footer={null}
//             >
//                 {hasValidCoordinates && (
//                     <MapCar latitude={localite.latitude} longitude={localite.longitude} selectedItem={localite} type="localite" />
//                 )}
//             </Modal>
//         </div>
//     )
// }

// function DocumentInfoCard({ document }) {
//     return (
//         <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
//             <div className="px-4 py-5 sm:p-6">
//                 <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{"Document"}</h3>
//                 <div className="space-y-4">
//                     <InfoItem icon={<FileText className="w-5 h-5" />} label={"Type document"} value={document.type} />
//                     <InfoItem icon={<FileText className="w-5 h-5" />} label={"Date de renseignement"} value={document.date} />
//                 </div>
//             </div>
//         </div>
//     )
// }

// function InfoItem({ icon, label, value }) {
//     return (
//         <div className="flex items-center space-x-3">
//             <div className="flex-shrink-0 text-gray-400">{icon}</div>
//             <div>
//                 <p className="text-sm font-medium text-gray-500">{label}</p>
//                 <p className="mt-1 text-sm text-gray-900">{value || "N/A"}</p>
//             </div>
//         </div>
//     )
// }
// function InfoItemCoordonnee({ icon, label, value, latitude, longitude, setIsMapModalVisible, isMapModalVisible }) {
//     // Vérifier que les coordonnées sont valides avant d'activer le bouton
//     const hasValidCoordinates =
//         latitude && longitude && !isNaN(Number.parseFloat(latitude)) && !isNaN(Number.parseFloat(longitude))

//     return (
//         <div className="flex items-center space-x-3">
//             <div className="flex-shrink-0 text-gray-400">{icon}</div>
//             <div className="flex-grow">
//                 <p className="text-sm font-medium text-gray-500">{label}</p>
//                 <p className="mt-1 text-sm text-gray-900">{value || "N/A"}</p>
//             </div>
//             {hasValidCoordinates && (
//                 <Tooltip title="Voir sur la carte">
//                     {/* <Button type="text" icon={<EnvironmentOutlined />}
//                         onClick={() => setIsMapModalVisible(!isMapModalVisible)} /> */}

//                     <Button
//                         type="text"
//                         className="bg-primary text-white"
//                         icon={<EnvironmentOutlined />}
//                         onClick={() => setIsMapModalVisible(!isMapModalVisible)}
//                     />
//                 </Tooltip>
//             )}
//         </div>
//     )
// }

// function DocumentGenereInfoCard({ documentGenerer }) {
//     const [isViewerOpen, setIsViewerOpen] = useState(false)
//     const { urlBackend } = useContext(AppContext);
//     const handleViewDocument = () => {
//         console.log(documentGenerer.fichier)
//         if (documentGenerer.fichier) {
//             const pdfUrl = `${urlBackend}generers/${documentGenerer.fichier}`;
//             console.log(pdfUrl)
//             window.open(pdfUrl, "_blank")
//         }
//     }

//     const getDocumentTypeLabel = (type) => {
//         switch (type) {
//             case "PERMIS_OCCUPATION":
//                 return "Permis d'Occupation"
//             case "BAIL_COMMUNAL":
//                 return "Bail Communal"
//             case "PROPOSITION_BAIL":
//                 return "Proposition de Bail"
//             default:
//                 return type
//         }
//     }

//     const formatMontant = (montant) => {
//         return new Intl.NumberFormat("fr-FR", {
//             style: "currency",
//             currency: "XOF",
//             minimumFractionDigits: 0,
//         }).format(montant)
//     }

//     return (
//         <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-green-500">
//             <div className="px-4 py-5 sm:p-6">
//                 <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-medium leading-6 text-gray-900">Document généré</h3>
//                     <div className="flex space-x-2">
//                         <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Généré</span>
//                         {documentGenerer.fichier && <>
//                             <Button
//                                 className="ant-btn-primary"
//                                 size="small"
//                                 icon={<PaperClipOutlined />}
//                                 onClick={handleViewDocument}
//                             >
//                                 Voir PDF
//                             </Button>
//                         </>


//                         }
//                     </div>
//                 </div>

//                 <div className="space-y-4">
//                     <InfoItem
//                         icon={<FileText className="w-5 h-5" />}
//                         label="Type de document"
//                         value={getDocumentTypeLabel(documentGenerer.type)}
//                     />
//                     <InfoItem
//                         icon={<Calendar className="w-5 h-5" />}
//                         label="Date de création"
//                         value={new Date(documentGenerer.dateCreation).toLocaleDateString("fr-FR")}
//                     />


//                     {/* Informations spécifiques selon le type de document */}
//                     {documentGenerer.contenu && (
//                         <>
//                             <div className="border-t pt-4 mt-4">
//                                 <h4 className="text-md font-medium text-gray-700 mb-3">Détails du document</h4>

//                                 <InfoItem
//                                     icon={<Calendar className="w-5 h-5" />}
//                                     label="Date de délivrance"
//                                     value={new Date(documentGenerer.contenu.dateDelivrance).toLocaleDateString("fr-FR")}
//                                 />

//                                 <InfoItem
//                                     icon={<MapPin className="w-5 h-5" />}
//                                     label="Localité"
//                                     value={documentGenerer.contenu.localite}
//                                 />

//                                 <InfoItem
//                                     icon={<Building className="w-5 h-5" />}
//                                     label="Lotissement"
//                                     value={documentGenerer.contenu.lotissement}
//                                 />

//                                 <InfoItem
//                                     icon={<FileText className="w-5 h-5" />}
//                                     label="Numéro de parcelle"
//                                     value={documentGenerer.contenu.numeroParcelle}
//                                 />

//                                 <InfoItem
//                                     icon={<Award className="w-5 h-5" />}
//                                     label="Superficie"
//                                     value={`${documentGenerer.contenu.superficie} m²`}
//                                 />

//                                 {/* Informations CNI */}
//                                 {documentGenerer.contenu.cni && (
//                                     <div className="border-t pt-3 mt-3">
//                                         <h5 className="text-sm font-medium text-gray-600 mb-2">Informations CNI</h5>
//                                         <InfoItem
//                                             icon={<FileText className="w-5 h-5" />}
//                                             label="Numéro CNI"
//                                             value={documentGenerer.contenu.cni.numero}
//                                         />
//                                         <InfoItem
//                                             icon={<Calendar className="w-5 h-5" />}
//                                             label="Date de délivrance CNI"
//                                             value={documentGenerer.contenu.cni.dateDelivrance}
//                                         />
//                                         <InfoItem
//                                             icon={<MapPin className="w-5 h-5" />}
//                                             label="Lieu de délivrance CNI"
//                                             value={documentGenerer.contenu.cni.lieuDelivrance}
//                                         />
//                                     </div>
//                                 )}

//                                 {/* Informations spécifiques à la proposition de bail */}
//                                 {documentGenerer.contenu.propositionBail && (
//                                     <div className="border-t pt-3 mt-3">
//                                         <h5 className="text-sm font-medium text-gray-600 mb-2">Proposition de Bail</h5>
//                                         <InfoItem
//                                             icon={<FileText className="w-5 h-5" />}
//                                             label="Référence"
//                                             value={documentGenerer.contenu.propositionBail.reference}
//                                         />
//                                         <InfoItem
//                                             icon={<Building className="w-5 h-5" />}
//                                             label="Type de bail"
//                                             value={documentGenerer.contenu.propositionBail.typeBail}
//                                         />
//                                         <InfoItem
//                                             icon={<Calendar className="w-5 h-5" />}
//                                             label="Durée"
//                                             value={documentGenerer.contenu.propositionBail.duree}
//                                         />
//                                         <InfoItem
//                                             icon={<Globe className="w-5 h-5" />}
//                                             label="Montant location"
//                                             value={formatMontant(documentGenerer.contenu.propositionBail.montantLocation)}
//                                         />
//                                         <InfoItem
//                                             icon={<Globe className="w-5 h-5" />}
//                                             label="Montant caution"
//                                             value={formatMontant(documentGenerer.contenu.propositionBail.montantCaution)}
//                                         />
//                                     </div>
//                                 )}

//                                 {/* Informations spécifiques au bail communal */}
//                                 {documentGenerer.contenu.numeroBail && (
//                                     <div className="border-t pt-3 mt-3">
//                                         <h5 className="text-sm font-medium text-gray-600 mb-2">Bail Communal</h5>
//                                         <InfoItem
//                                             icon={<FileText className="w-5 h-5" />}
//                                             label="Numéro de bail"
//                                             value={documentGenerer.contenu.numeroBail}
//                                         />
//                                         <InfoItem
//                                             icon={<Globe className="w-5 h-5" />}
//                                             label="Montant location"
//                                             value={formatMontant(documentGenerer.contenu.montantLocation)}
//                                         />
//                                         <InfoItem
//                                             icon={<Globe className="w-5 h-5" />}
//                                             label="Montant caution"
//                                             value={formatMontant(documentGenerer.contenu.montantCaution)}
//                                         />
//                                         <InfoItem
//                                             icon={<Calendar className="w-5 h-5" />}
//                                             label="Date de début"
//                                             value={new Date(documentGenerer.contenu.dateDebut).toLocaleDateString("fr-FR")}
//                                         />
//                                         <InfoItem
//                                             icon={<Calendar className="w-5 h-5" />}
//                                             label="Date de fin"
//                                             value={new Date(documentGenerer.contenu.dateFin).toLocaleDateString("fr-FR")}
//                                         />
//                                     </div>
//                                 )}

//                                 {/* Informations spécifiques au permis d'occupation */}
//                                 {documentGenerer.contenu.numeroPermis && (
//                                     <div className="border-t pt-3 mt-3">
//                                         <h5 className="text-sm font-medium text-gray-600 mb-2">Permis d'Occupation</h5>
//                                         <InfoItem
//                                             icon={<FileText className="w-5 h-5" />}
//                                             label="Numéro de permis"
//                                             value={documentGenerer.contenu.numeroPermis}
//                                         />
//                                         <InfoItem
//                                             icon={<Calendar className="w-5 h-5" />}
//                                             label="Durée de validité"
//                                             value={documentGenerer.contenu.dureeValidite}
//                                         />
//                                         <InfoItem
//                                             icon={<Building className="w-5 h-5" />}
//                                             label="Usage autorisé"
//                                             value={documentGenerer.contenu.usage}
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         </>
//                     )}

//                 </div>
//             </div>
//         </div>
//     )
// }

// function LoadingSkeleton() {
//     return (
//         <div className="bg-gray-100 min-h-screen pb-10">
//             <header className="bg-white shadow">
//                 <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//                     <div className="h-9 w-64 bg-gray-200 rounded animate-pulse"></div>
//                 </div>
//             </header>
//             <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//                 <div className="px-4 py-6 sm:px-0">
//                     <div className="grid gap-6 md:grid-cols-2">
//                         {[...Array(4)].map((_, i) => (
//                             <div key={i} className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
//                                 <div className="px-4 py-5 sm:p-6">
//                                     <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
//                                     {[...Array(5)].map((_, j) => (
//                                         <div key={j} className="flex items-center space-x-3 mt-4">
//                                             <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
//                                             <div className="space-y-2">
//                                                 <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
//                                                 <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </main>
//         </div>
//     )
// }

// function ErrorDisplay({ error }) {
//     return (
//         <div className="flex justify-center items-center h-screen bg-gray-100">
//             <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary w-full max-w-md">
//                 <div className="px-4 py-5 sm:p-6">
//                     <h3 className="text-lg font-medium leading-6 text-red-600 mb-4">Erreur</h3>
//                     <p className="text-center">{error}</p>
//                 </div>
//             </div>
//         </div>
//     )
// }

// function FilePreview({ file, title }) {
//     const fileType = file.startsWith('/9j/') ? 'image/jpeg'
//         : file.startsWith('iVBORw0KGgo') ? 'image/png'
//             : 'application/pdf'

//     return (
//         <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
//             <div className="px-4 py-5 sm:p-6">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
//                 <div className="bg-gray-200 rounded-lg p-4">
//                     {fileType.startsWith('image/') ? (
//                         <img
//                             src={`data:${fileType};base64,${file}`}
//                             alt={title}
//                             className="w-full h-auto max-h-[400px] object-contain"
//                         />
//                     ) : (
//                         <iframe
//                             src={`data:application/pdf;base64,${file}`}
//                             title={title}
//                             className="w-full h-[400px]"
//                         />
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }


// pages/admin/demandes/AdminDemandeDetails.jsx
"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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
  Landmark,
  Layers,
  ClipboardList,
} from "lucide-react";
import {
  getDemandeDetails,
  getFileDocument,
  updateDemandeRefus,
  updateDemandeStatut,
} from "@/services/demandeService";
import { useAuthContext } from "@/context";
import { AdminBreadcrumb as Breadcrumb } from "@/components";
import { cn } from "@/utils";
import MapCar from "../../../admin/Map/MapCar";
import { formatCoordinates, formatPhoneNumber, formatPrice } from "@/utils/formatters";
import { Button, Modal, Popover, Space, Tooltip, message, Tag, Select } from "antd";
import { EditOutlined, EnvironmentOutlined, InfoCircleOutlined, PaperClipOutlined, SaveOutlined, UserAddOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { AppContext } from "@/AppContext";
import { getDetaitHabitant } from "@/services/userService";

// --- Helpers rôles à ajuster si besoin ---
const CAN_UPDATE_STATUT_ROLES = ["ROLE_MAIRE", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"];
const CAN_SET_RECOMMANDATION_ROLES = ["ROLE_PRESIDENT_COMMISSION", "ROLE_CHEF_SERVICE"];
const CAN_SET_RAPPORT_ROLES = ["ROLE_AGENT", "ROLE_AGENT_URBANISME", "ROLE_AGENT_DOMAINE"]; // adapte
const CAN_SET_DECISION_ROLES = ["ROLE_COMMISSION"]; // adapte si nécessaire

const hasAnyRole = (user, roles) => user?.roles?.some(r => roles.includes(r));

// mapping statut backend -> couleurs + labels
const STATUT_LABEL = {
  "En attente": "En attente",
  "En cours de traitement": "En cours de traitement",
  "Rejetée": "Rejetée",
  "Approuvée": "Approuvée",
};

const STATUT_BADGE = {
  "En attente": "bg-yellow-50 text-yellow-800 border border-yellow-300",
  "En cours de traitement": "bg-blue-50 text-blue-800 border border-blue-300",
  "Rejetée": "bg-red-50 text-red-800 border border-red-300",
  "Approuvée": "bg-green-50 text-green-800 border border-green-300",
};

const STATUT_OPTIONS = Object.keys(STATUT_LABEL).map(v => ({ label: STATUT_LABEL[v], value: v }));

export default function AdminDemandeDetails() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [demande, setDemande] = useState(null);
  const [rectoFile, setRectoFile] = useState(null);
  const [versoFile, setVersoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // états d’édition rôle-dépendants
  const [editingRefus, setEditingRefus] = useState(false);
  const [motifRefus, setMotifRefus] = useState("");

  const [editingStatut, setEditingStatut] = useState(false);
  const [newStatut, setNewStatut] = useState("");

  const [editingRapport, setEditingRapport] = useState(false);
  const [rapport, setRapport] = useState("");

  const [editingReco, setEditingReco] = useState(false);
  const [recommandation, setRecommandation] = useState("");

  const [editingDecision, setEditingDecision] = useState(false);
  const [decision, setDecision] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getDemandeDetails(id);
        setDemande(data);
        setMotifRefus(data.motif_refus || "");
        setRapport(data.rapport || "");
        setRecommandation(data.recommandation || "");
        setDecision(data.decisionCommission || "");
        if (data.document) {
          const response = await getFileDocument(id);
          setRectoFile(response["recto"]);
          setVersoFile(response["verso"]);
        }
      } catch (err) {
        setError(err.message || "Erreur");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // permissions
  const canUpdateStatut = useMemo(() => hasAnyRole(user, CAN_UPDATE_STATUT_ROLES), [user]);
  const canEditReco = useMemo(() => hasAnyRole(user, CAN_SET_RECOMMANDATION_ROLES), [user]);
  const canEditRapport = useMemo(() => hasAnyRole(user, CAN_SET_RAPPORT_ROLES), [user]);
  const canEditDecision = useMemo(() => hasAnyRole(user, CAN_SET_DECISION_ROLES), [user]);
  const canEditRefus = useMemo(() => hasAnyRole(user, CAN_UPDATE_STATUT_ROLES), [user]); // même règles que statut (admin/maire)

  const saveMotifRefus = async () => {
    if (!motifRefus.trim()) return message.error("Le motif ne peut pas être vide");
    try {
      await updateDemandeRefus(id, motifRefus);
      setDemande(prev => ({ ...prev, motif_refus: motifRefus }));
      setEditingRefus(false);
      message.success("Motif de rejet mis à jour");
    } catch (e) {
      message.error(e.message || "Erreur MAJ motif");
    }
  };

  const saveStatut = async () => {
    if (!newStatut) return message.error("Sélectionnez un statut");
    try {
      await updateDemandeStatut(id, newStatut);
      setDemande(prev => ({ ...prev, statut: newStatut, dateModification: new Date().toISOString() }));
      setEditingStatut(false);
      message.success("Statut mis à jour");
    } catch (e) {
      message.error(e.message || "Erreur MAJ statut");
    }
  };

  const saveRapport = async () => {
    try {
    //   await updateRapport(id, rapport);
      setDemande(prev => ({ ...prev, rapport }));
      setEditingRapport(false);
      message.success("Rapport enregistré");
    } catch (e) {
      message.error(e.message || "Erreur MAJ rapport");
    }
  };

  const saveRecommandation = async () => {
    try {
    //   await updateRecommandation(id, recommandation);
      setDemande(prev => ({ ...prev, recommandation }));
      setEditingReco(false);
      message.success("Recommandation enregistrée");
    } catch (e) {
      message.error(e.message || "Erreur MAJ recommandation");
    }
  };

  const saveDecision = async () => {
    try {
    //   await updateDecisionCommission(id, decision);
      setDemande(prev => ({ ...prev, decisionCommission: decision }));
      setEditingDecision(false);
      message.success("Décision enregistrée");
    } catch (e) {
      message.error(e.message || "Erreur MAJ décision");
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  if (!demande) return null;


  return (
    <>
      <Breadcrumb title="Détails de la demande" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <div className="bg-gray-100 min-h-screen pb-10">
                <header className="bg-white shadow">
                  <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Détail de la demande</h1>
                  </div>
                </header>
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <div className="px-4 py-6 sm:px-0">
                    <div className="grid gap-6 lg:grid-cols-2">
                      <DemandeInfoCard
                        demande={demande}
                        canUpdateStatut={canUpdateStatut}
                        editingStatut={editingStatut}
                        setEditingStatut={setEditingStatut}
                        newStatut={newStatut}
                        setNewStatut={setNewStatut}
                        saveStatut={saveStatut}
                      />
                      <DemandeurInfoCard demandeur={demande.demandeur} />
                      <LocaliteInfoCard localite={demande.localite} />

                      {/* Rapport (agents) */}
                      <RoleSection
                        title="Rapport"
                        icon={<ClipboardList className="w-5 h-5" />}
                        value={demande.rapport}
                        editable={canEditRapport}
                        editing={editingRapport}
                        setEditing={setEditingRapport}
                        onSave={saveRapport}
                        onChange={setRapport}
                        editValue={rapport}
                        placeholder="Saisissez le rapport de l'agent…"
                        color="primary"
                      />

                      {/* Recommandation (président de commission & chef de service) */}
                      <RoleSection
                        title="Recommandation"
                        icon={<Layers className="w-5 h-5" />}
                        value={demande.recommandation}
                        editable={canEditReco}
                        editing={editingReco}
                        setEditing={setEditingReco}
                        onSave={saveRecommandation}
                        onChange={setRecommandation}
                        editValue={recommandation}
                        placeholder="Saisissez la recommandation…"
                        color="blue"
                      />

                      {/* Décision de commission (commission) */}
                      <RoleSection
                        title="Décision de la commission"
                        icon={<Landmark className="w-5 h-5" />}
                        value={demande.decisionCommission}
                        editable={canEditDecision}
                        editing={editingDecision}
                        setEditing={setEditingDecision}
                        onSave={saveDecision}
                        onChange={setDecision}
                        editValue={decision}
                        placeholder="Saisissez la décision de la commission…"
                        color="green"
                      />

                      {/* Motif de rejet (admin/maire) si statut Rejetée */}
                      {demande.statut === "Rejetée" && (
                        <RefusCard
                          value={demande.motif_refus}
                          editable={canEditRefus}
                          editing={editingRefus}
                          setEditing={setEditingRefus}
                          editValue={motifRefus}
                          setEditValue={setMotifRefus}
                          onSave={saveMotifRefus}
                        />
                      )}

                      {/* Niveau de validation + historique */}
                      <ValidationCard demande={demande} />
                    </div>

                    {(rectoFile || versoFile) && (
                      <div className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Documents fournis</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                          {rectoFile && <FilePreview file={rectoFile} title="Recto du document" />}
                          {versoFile && <FilePreview file={versoFile} title="Verso du document" />}
                        </div>
                      </div>
                    )}
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DemandeInfoCard({
  demande,
  canUpdateStatut,
  editingStatut,
  setEditingStatut,
  newStatut,
  setNewStatut,
  saveStatut,
}) {
  const statutClass = STATUT_BADGE[demande.statut] || "bg-gray-100 text-gray-800 border";

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
            const habitantInfo = await getDetaitHabitant(demande.demandeur.id)
            console.log("habitante", habitantInfo)
            setHabitantData(habitantInfo)
        } catch (error) {
            console.error("Erreur lors de la récupération des informations du habitant:", error)
        } finally {
            setLoadingHabitant(false)
        }
    }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Informations de la demande</h3>
          <div className="flex gap-2">
            <Tag className={cn("px-2 py-1 text-xs font-semibold rounded-full", statutClass)}>
              {STATUT_LABEL[demande.statut] || demande.statut}
            </Tag>
          </div>
        </div>

        <div className="mt-4 grid gap-4">
          <InfoItem icon={<Calendar className="w-5 h-5" />} label="Date de création" value={new Date(demande.dateCreation).toLocaleDateString("fr-FR")} />
          <InfoItem icon={<FileText className="w-5 h-5" />} label="Type de demande" value={demande.typeDemande} />
          <InfoItem icon={<FileText className="w-5 h-5" />} label="Type de titre" value={demande.typeTitre} />
          <InfoItem icon={<Award className="w-5 h-5" />} label="Superficie" value={`${demande.superficie} m²`} />
          <InfoItem icon={<FileText className="w-5 h-5" />} label="Usage prévu" value={demande.usagePrevu} />
          <InfoItem icon={<FileText className="w-5 h-5" />} label="Type de document" value={demande.typeDocument} />
          <InfoItem icon={<CheckCircle className="w-5 h-5" />} label="Possède autre terrain" value={demande.possedeAutreTerrain ? "Oui" : "Non"} />
          <div className="flex items-center gap-3">
            <Tag color={demande.terrainAKaolack ? "green" : "red"}>Terrain à Kaolack : {demande.terrainAKaolack ? "Oui" : "Non"}</Tag>
            <Tag color={demande.terrainAilleurs ? "green" : "red"}>Terrain ailleurs : {demande.terrainAilleurs ? "Oui" : "Non"}</Tag>
          </div>

          {/* Edition du statut selon rôles */}
          {canUpdateStatut && (
            <div className="mt-2">
              {!editingStatut ? (
                <Button icon={<EditOutlined />} onClick={() => { setNewStatut(demande.statut); setEditingStatut(true); }}>
                  Modifier le statut
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Select
                    value={newStatut}
                    options={STATUT_OPTIONS}
                    onChange={setNewStatut}
                    style={{ minWidth: 220 }}
                  />
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={saveStatut}
                  >
                    Enregistrer
                  </Button>
                  <Button onClick={() => setEditingStatut(false)}>Annuler</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RefusCard({ value, editable, editing, setEditing, editValue, setEditValue, onSave }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-red-500">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium leading-6 text-red-700 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Motif du rejet
          </h3>
          {editable && !editing && (
            <Button type="text" icon={<EditOutlined />} onClick={() => setEditing(true)} />
          )}
        </div>

        {!editing ? (
          <div className="text-red-700 bg-red-50 p-3 rounded border border-red-200">
            {value || "Aucun motif spécifié"}
          </div>
        ) : (
          <div className="space-y-3">
            <TextArea rows={4} value={editValue} onChange={e => setEditValue(e.target.value)} placeholder="Saisissez le motif de rejet…" />
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setEditing(false)}>Annuler</Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>Enregistrer</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RoleSection({
  title,
  icon,
  value,
  editable,
  editing,
  setEditing,
  onSave,
  onChange,
  editValue,
  placeholder,
  color = "primary",
}) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
            {icon}{title}
          </h3>
          {editable && !editing && (
            <Button type="text" icon={<EditOutlined />} onClick={() => setEditing(true)} />
          )}
        </div>

        {!editing ? (
          <div className="bg-gray-50 p-3 rounded border border-gray-200 min-h-[48px]">
            {value || <span className="text-gray-400">—</span>}
          </div>
        ) : (
          <div className="space-y-3">
            <TextArea rows={4} value={editValue} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setEditing(false)}>Annuler</Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>Enregistrer</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// function DemandeurInfoCard({ demandeur }) {
//   return (
//     <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
//       <div className="px-4 py-5 sm:p-6">
//         <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Informations du demandeur</h3>
//         <div className="space-y-3">
//           <InfoItem icon={<User className="w-5 h-5" />} label="Nom complet" value={`${demandeur?.prenom} ${demandeur?.nom}`} />
//           <InfoItem icon={<Mail className="w-5 h-5" />} label="Email" value={demandeur?.email} />
//           <InfoItem icon={<Phone className="w-5 h-5" />} label="Téléphone" value={formatPhoneNumber(demandeur?.telephone)} />
//           <InfoItem icon={<MapPin className="w-5 h-5" />} label="Adresse" value={demandeur?.adresse} />
//           <InfoItem icon={<Calendar className="w-5 h-5" />} label="Date de naissance" value={demandeur?.dateNaissance ? new Date(demandeur.dateNaissance).toLocaleDateString("fr-FR") : ""} />
//           <InfoItem icon={<MapPin className="w-5 h-5" />} label="Lieu de naissance" value={demandeur?.lieuNaissance} />
//           <InfoItem icon={<FileText className="w-5 h-5" />} label="Numéro électeur" value={demandeur?.numeroElecteur} />
//           <InfoItem icon={<Briefcase className="w-5 h-5" />} label="Profession" value={demandeur?.profession} />
//           <InfoItem icon={<CheckCircle className="w-5 h-5" />} label="Habitant" value={demandeur?.isHabitant ? "Oui" : "Non"} />
//                            {demandeur.isHabitant && (
//                         <Space>
//                             <span>Informations détaillées:</span>
//                             <Popover
//                                 content={renderHabitantContent()}
//                                 title="Informations détaillées"
//                                 trigger="click"
//                                 placement="right"
//                                 overlayStyle={{ maxWidth: "800px" }}
//                                 onVisibleChange={(visible) => {
//                                     if (visible) {
//                                         fetchHabitantInfo()
//                                     }
//                                 }}
//                             >
//                                 <Button type="text" icon={<InfoCircleOutlined />} className="text-primary" loading={loadingHabitant} />
//                             </Popover>
//                         </Space>
//                     )}
//         </div>
//       </div>
//     </div>
//   );
// }

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


function LocaliteInfoCard({ localite }) {
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const hasValidCoordinates = !!(localite?.latitude && localite?.longitude && !isNaN(+localite.latitude) && !isNaN(+localite.longitude));

  if (!localite) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Localité</h3>
          <p className="text-sm text-gray-500">Aucune localité associée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Localité</h3>
        <div className="space-y-3">
          <InfoItem icon={<Building className="w-5 h-5" />} label="Nom" value={localite.nom} />
          {"prix" in localite && <InfoItem icon={<Globe className="w-5 h-5" />} label="Prix" value={formatPrice(localite.prix)} />}
          {localite.description && <InfoItem icon={<FileText className="w-5 h-5" />} label="Description" value={localite.description} />}
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

      <Modal title="Carte de la Localité" open={isMapModalVisible} onCancel={() => setIsMapModalVisible(false)} width={1000} footer={null}>
        {hasValidCoordinates && <MapCar latitude={localite.latitude} longitude={localite.longitude} selectedItem={localite} type="localite" />}
      </Modal>
    </div>
  );
}

function ValidationCard({ demande }) {
  const nv = demande?.niveauValidationActuel;
  const hist = demande?.historiqueValidations || [];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary lg:col-span-2">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Circuit de validation</h3>

        {nv ? (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Tag color="blue">Niveau actuel</Tag>
              <span className="font-medium">{nv?.nom || nv?.label || `Niveau #${nv?.id}`}</span>
            </div>
            {nv?.description && <p className="text-sm text-gray-600 mt-1">{nv.description}</p>}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucun niveau de validation défini.</p>
        )}

        <div className="mt-3">
          <h4 className="font-semibold mb-2">Historique</h4>
          {hist.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun historique.</p>
          ) : (
            <div className="space-y-2">
              {hist.map((h, idx) => (
                <div key={idx} className="p-3 rounded border bg-gray-50">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>{h?.niveau?.nom || `Niveau #${h?.niveau?.id ?? "?"}`}</Tag>
                    {h?.acteur && <Tag color="purple">par {h.acteur?.nom || h.acteur?.email || "acteur"}</Tag>}
                    {h?.action && <Tag color="blue">{h.action}</Tag>}
                    {h?.date && <span className="text-xs text-gray-500">{new Date(h.date).toLocaleString("fr-FR")}</span>}
                  </div>
                  {h?.commentaire && <p className="text-sm mt-1">{h.commentaire}</p>}
                </div>
              ))}
            </div>
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
        <p className="mt-1 text-sm text-gray-900">{value ?? "N/A"}</p>
      </div>
    </div>
  );
}

function InfoItemCoordonnee({ icon, label, value, latitude, longitude, setIsMapModalVisible, isMapModalVisible }) {
  const hasValidCoordinates = !!(latitude && longitude && !isNaN(+latitude) && !isNaN(+longitude));
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0 text-gray-400">{icon}</div>
      <div className="flex-grow">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-sm text-gray-900">{value || "N/A"}</p>
      </div>
      {hasValidCoordinates && (
        <Tooltip title="Voir sur la carte">
          <Button type="text" className="bg-primary text-white" icon={<EnvironmentOutlined />} onClick={() => setIsMapModalVisible(!isMapModalVisible)} />
        </Tooltip>
      )}
    </div>
  );
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
              <div key={i} className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
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
  );
}

function ErrorDisplay({ error }) {
  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-gray-100">
      <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary w-full max-w-md">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-red-600 mb-4">Erreur</h3>
          <p className="text-center">{error}</p>
        </div>
      </div>
    </div>
  );
}

function FilePreview({ file, title }) {
  const fileType = file?.startsWith("/9j/") ? "image/jpeg" : file?.startsWith("iVBORw0KGgo") ? "image/png" : "application/pdf";
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="bg-gray-200 rounded-lg p-4">
          {fileType.startsWith("image/") ? (
            <img src={`data:${fileType};base64,${file}`} alt={title} className="w-full h-auto max-h-[400px] object-contain" />
          ) : (
            <iframe src={`data:application/pdf;base64,${file}`} title={title} className="w-full h-[400px]" />
          )}
        </div>
      </div>
    </div>
  );
}
