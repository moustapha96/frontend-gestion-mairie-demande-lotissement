// "use client"
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { AdminBreadcrumb } from "@/components";
// import { toast } from "sonner";
// import { generateDocument, getDemandeDetails, getFileDocument } from "@/services/demandeService";
// import { cn } from "@/utils";
// import { getLocaliteDtailsConfirmation, getLocaliteLotissement, getLocalites } from "@/services/localiteService";
// import { getLots } from "@/services/lotsService";
// import { Loader2, Save, Search } from 'lucide-react';
// import { LuFileText } from "react-icons/lu";
// import { formatCoordinates, formatPhoneNumber, formatPrice } from "@/utils/formatters";
// import MapCar from "../../Map/MapCar";
// // En haut du fichier
// const AdminDemandeConfirmation = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [localite, setLocalite] = useState({});
//     const [lotissements, setLotissements] = useState([]);
//     const [lots, setLots] = useState([]);

//     const [selectedLotissement, setSelectedLotissement] = useState('');
//     const [parcelles, setParcelles] = useState([]);


//     const [demande, setDemande] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [formData, setFormData] = useState({
//         // Informations du document
//         document: {
//             type: "PERMIS_OCCUPER",
//             reference: `N° C.KL/SG/DDPF ${new Date().getFullYear()}`,
//             dateDelivrance: new Date().toISOString().split('T')[0],
//             lieuSignature: "Kaolack",
//         },

//         // Informations administratives
//         administration: {
//             pays: "République du Sénégal",
//             region: "Kaolack",
//             commune: "Kaolack",
//             ampliations: ["S.G", "DDPF", "Intéressé", "Archives", "Cadastre", "Domaine"],
//         },

//         // Informations du bénéficiaire
//         beneficiaire: {
//             prenom: "",
//             nom: "",
//             dateNaissance: "",
//             lieuNaissance: "",
//             cni: {
//                 numero: "",
//                 dateDelivrance: "",
//                 lieuDelivrance: "",
//             }
//         },

//         // Informations de la parcelle
//         parcelle: {
//             lotissement: "",
//             numero: "",
//             superficie: "",
//             usage: "",
//             referenceCadastrale: "T.F...912... (propriété de la Commune de Kaolack)",
//         }
//     });

//     // Ajouter les états pour gérer le viewer
//     const [isViewerOpen, setIsViewerOpen] = useState(false);
//     const [fileLoading, setFileLoading] = useState(false);
//     const [activeDocument, setActiveDocument] = useState(null);
//     const [viewType, setViewType] = useState(null); // 'recto' ou 'verso'

//     // Ajouter la fonction pour gérer l'affichage des documents
//     const handleViewDocument = async (type) => {
//         try {
//             setFileLoading(true);
//             setViewType(type);
//             setIsViewerOpen(true);

//             // Récupérer le fichier depuis le service
//             const fileData = await getFileDocument(id);
//             // Utiliser le bon fichier selon le type (recto ou verso)
//             const document = type === 'recto' ? fileData.recto : fileData.verso;
//             setActiveDocument(document);
//         } catch (error) {
//             console.error('Erreur lors du chargement du document:', error);
//             toast.error("Erreur lors du chargement du document");
//         } finally {
//             setFileLoading(false);
//         }
//     };

//     // Ajouter la fonction pour fermer le viewer
//     const closeViewer = () => {
//         setIsViewerOpen(false);
//         setActiveDocument(null);
//         setViewType(null);
//     };

//     useEffect(() => {
//         const fetchDetailsLocalite = async () => {
//             try {
//                 const data = await getLocaliteDtailsConfirmation(id);
//                 setLocalite(data)
//                 setLotissements(data.lotissements);
//             } catch (error) {
//                 toast.error("Erreur lors du chargement des lotissements");
//             }
//         }
//         fetchDetailsLocalite();

//     }, [id]);

//     useEffect(() => {
//         const fetchDemande = async () => {
//             try {
//                 const data = await getDemandeDetails(id);
//                 setDemande(data);

//                 setFormData(prev => ({
//                     ...prev,
//                     superficie: data.superficie,
//                     usagePrevu: data.usagePrevu,
//                     localite: data.localite?.nom || '',
//                     localiteId: data.localite?.id || null,
//                     // numeroPermis: data.typeDemande === 'BAIL_COMMUNAL'
//                     //     ? `BC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`
//                     //     : `PO-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
//                     numeroPermis: data.typeDemande === 'BAIL_COMMUNAL'
//                         ? `BC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
//                         : `PO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
//                     // Calculer automatiquement la date de fin en fonction de la durée
//                     dateFin: data.typeDemande === 'BAIL_COMMUNAL'
//                         ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
//                         : '',
//                     adresseTerrain: data.localite?.nom || ''
//                 }));
//             } catch (error) {
//                 toast.error("Erreur lors du chargement de la demande");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDemande();
//     }, [id]);

//     const handleLotissementChange = async (lotissementId) => {
//         try {
//             if (!lotissementId) {
//                 setParcelles([]);
//                 setSelectedLotissement('');
//                 return;
//             }
//             setSelectedLotissement(lotissementId);

//             const lotissement = lotissements.find(lot => lot.id === Number(lotissementId));
//             console.log(lotissement)

//             if (!lotissement) {
//                 toast.error("Lotissement non trouvé");
//                 setParcelles([]);
//                 return;
//             }

//             setParcelles(lotissement.parcelles || []);

//             setFormData(prev => ({
//                 ...prev,
//                 lotissement: lotissement.nom,
//                 propositionBail: {
//                     ...prev.propositionBail,
//                     lotissement: lotissement.nom
//                 }
//             }));

//         } catch (error) {
//             console.error("Erreur lors du changement de lotissement:", error);
//             toast.error("Erreur lors du chargement des parcelles");
//             setParcelles([]);
//         }
//     };

//     const validateFormData = (data, type) => {
//         const commonValidation = data.document?.reference
//             && data.document?.dateDelivrance
//             && data.document?.lieuSignature
//             && data.parcelle?.numero;

//         switch (type) {
//             case 'PROPOSITION_BAIL':
//                 return commonValidation && (
//                     data.propositionBail?.typeBail
//                     && data.propositionBail?.duree
//                     && data.propositionBail?.montantLocation
//                 );

//             case 'BAIL_COMMUNAL':
//                 return commonValidation && (
//                     data.montantLocation
//                     && data.dateDebut
//                     && data.dateFin
//                 );

//             case 'PERMIS_OCCUPATION':
//                 return commonValidation && (
//                     data.dureeValidite
//                     && data.parcelle?.usage
//                 );

//             default:
//                 return false;
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         try {
//             let dataToSubmit = {
//                 demande: id,
//                 typeDemande: demande?.typeDemande
//             };

//             // Structure commune pour tous les types de documents
//             const commonData = {
//                 dateDelivrance: formData.document.dateDelivrance,
//                 superficie: Number(demande?.superficie) || 0,
//                 demandeId: demande?.id,
//                 usagePrevu: demande?.usagePrevu || '',
//                 localite: demande?.localite?.nom || '',
//                 referenceCadastrale: formData.parcelle.referenceCadastrale,
//                 lotissement: lotissements.find(lot => lot.id === Number(selectedLotissement))?.nom || '',
//                 numeroParcelle: formData.parcelle.numero,
//                 cni: {
//                     numero: formData.beneficiaire.cni.numero,
//                     dateDelivrance: formData.beneficiaire.cni.dateDelivrance,
//                     lieuDelivrance: formData.beneficiaire.cni.lieuDelivrance
//                 },
//                 beneficiaire: {
//                     prenom: demande?.demandeur?.prenom || '',
//                     nom: demande?.demandeur?.nom || '',
//                     dateNaissance: demande?.demandeur?.dateNaissance || '',
//                     lieuNaissance: demande?.demandeur?.lieuNaissance || ''
//                 }
//             };
//             switch (demande?.typeDemande) {
//                 case 'PERMIS_OCCUPATION':
//                     dataToSubmit = {
//                         ...dataToSubmit,
//                         ...commonData,
//                         numeroPermis: `PO-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
//                         dureeValidite: `${formData.dureeValidite} an${formData.dureeValidite > 1 ? 's' : ''}`,
//                         usage: formData.parcelle.usage
//                     };
//                     break;

//                 case 'BAIL_COMMUNAL':
//                     dataToSubmit = {
//                         ...dataToSubmit,
//                         ...commonData,
//                         numeroBail: `BC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
//                         montantLocation: Number(formData.montantLocation),
//                         montantCaution: Number(formData.montantLocation) * 3,
//                         dateDebut: formData.dateDebut,
//                         dateFin: formData.dateFin
//                     };
//                     break;

//                 case 'PROPOSITION_BAIL':
//                     dataToSubmit = {
//                         ...dataToSubmit,
//                         ...commonData,
//                         propositionBail: {
//                             reference: `PB-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
//                             typeBail: formData.propositionBail?.typeBail,
//                             duree: `${formData.propositionBail?.duree} an${formData.propositionBail?.duree > 1 ? 's' : ''}`,
//                             montantLocation: Number(formData.propositionBail?.montantLocation),
//                             montantCaution: Number(formData.propositionBail?.montantLocation) * 3
//                         }
//                     };
//                     break;

//                 default:
//                     throw new Error("Type de document non supporté");
//             }
//             console.log(dataToSubmit)
//             if (!validateFormData(dataToSubmit, demande?.typeDemande)) {
//                 toast.error("Veuillez remplir tous les champs obligatoires");
//                 return;
//             }

//             console.log("Données à envoyer:", dataToSubmit);
//             await generateDocument(id, dataToSubmit);
//             toast.success("Document généré avec succès");
//             navigate(`/admin/demandes/${id}/details`);
//         } catch (error) {
//             console.error("Erreur lors de la génération:", error);
//             toast.error("Erreur lors de la génération du document");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (loading) {
//         return <div className="flex justify-center items-center h-screen">Chargement...</div>;
//     }

//     return (
//         <>
//             <AdminBreadcrumb title="Confirmation de la demande" />
//             <section>
//                 <div className="container">
//                     <div className="my-6 space-y-6">
//                         <div className="bg-white shadow-lg rounded-lg overflow-hidden">

//                             <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
//                                 <h2 className="text-2xl font-bold text-gray-800">
//                                     Confirmation de la demande #{id}
//                                 </h2>
//                                 <span className={cn(
//                                     "px-4 py-2 rounded-full text-sm font-semibold",
//                                     demande?.typeDemande === "PERMIS_OCCUPATION"
//                                         ? "bg-green-100 text-green-800"
//                                         : demande?.typeDemande === "BAIL_COMMUNAL"
//                                             ? "bg-blue-100 text-blue-800"
//                                             : "bg-yellow-100 text-yellow-800"
//                                 )}>
//                                     {demande?.typeDemande === "PERMIS_OCCUPATION"
//                                         ? "Permis d'Occupation"
//                                         : demande?.typeDemande === "BAIL_COMMUNAL"
//                                             ? "Bail Communal"
//                                             : "Proposition de Bail"}
//                                 </span>
//                             </div>

//                             <div className="border-b border-gray-200">
//                                 <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:grid-cols-2 gap-6">


//                                     <div className="space-y-4">
//                                         <h3 className="font-semibold text-lg text-gray-900">Informations du demandeur</h3>
//                                         <div className="space-y-2">

//                                             <div>
//                                                 <span className="text-sm text-gray-500">Nom complet:</span>
//                                                 <p className="font-medium">{demande?.demandeur?.prenom} {demande?.demandeur?.nom}</p>
//                                             </div>
//                                             <div>
//                                                 <span className="text-sm text-gray-500">Email:</span>
//                                                 <p className="font-medium">{demande?.demandeur?.email}</p>
//                                             </div>
//                                             <div>
//                                                 <span className="text-sm text-gray-500">Téléphone:</span>
//                                                 <p className="font-medium">{formatPhoneNumber(demande?.demandeur?.telephone)} </p>
//                                             </div>
//                                             <div>
//                                                 <span className="text-sm text-gray-500">Adresse:</span>
//                                                 <p className="font-medium">{demande?.demandeur?.adresse}</p>
//                                             </div>

//                                             <div className="mt-4 space-y-2">
//                                                 <div>
//                                                     <span className="text-sm text-gray-500">Date de naissance:</span>
//                                                     <p className="font-medium">{demande?.demandeur?.dateNaissance ? new Date(demande.demandeur.dateNaissance).toLocaleDateString('fr-FR') : 'Non renseigné'}</p>
//                                                 </div>
//                                                 <div>
//                                                     <span className="text-sm text-gray-500">Lieu de naissance:</span>
//                                                     <p className="font-medium">{demande?.demandeur?.lieuNaissance || 'Non renseigné'}</p>
//                                                 </div>
//                                                 <div>
//                                                     <span className="text-sm text-gray-500">Profession:</span>
//                                                     <p className="font-medium">{demande?.demandeur?.profession || 'Non renseigné'}</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="space-y-4">
//                                         <h3 className="font-semibold text-lg text-gray-900">Détails de la demande</h3>
//                                         <div className="space-y-2">
//                                             <div>
//                                                 <span className="text-sm text-gray-500">Date de soumission:</span>
//                                                 <p className="font-medium">
//                                                     {new Date(demande?.dateCreation).toLocaleDateString('fr-FR')}
//                                                 </p>
//                                             </div>
//                                             <div>
//                                                 <span className="text-sm text-gray-500">Type de demande:</span>
//                                                 <p className="font-medium">
//                                                     {demande?.typeDemande === "PERMIS_OCCUPATION"
//                                                         ? "Permis d'Occupation"
//                                                         : demande?.typeDemande === "BAIL_COMMUNAL"
//                                                             ? "Bail Communal"
//                                                             : "Proposition de Bail"}
//                                                 </p>
//                                             </div>
//                                             <div className="mt-4">
//                                                 <h4 className="font-medium text-gray-700 mb-2">Documents d'identification</h4>
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                     <div>
//                                                         <span className="text-sm text-gray-500 block mb-1">Recto:</span>


//                                                         <button
//                                                             onClick={() => handleViewDocument('recto')}
//                                                             className="text-primary hover:text-primary-700 flex items-center space-x-1"
//                                                         >
//                                                             <LuFileText className="w-5 h-5" />
//                                                             <span>Recto</span>
//                                                         </button>
//                                                     </div>
//                                                     <div>
//                                                         <span className="text-sm text-gray-500 block mb-1">Verso:</span>

//                                                         <button
//                                                             onClick={() => handleViewDocument('verso')}
//                                                             className="text-primary hover:text-primary-700 flex items-center space-x-1"
//                                                         >
//                                                             <LuFileText className="w-5 h-5" />
//                                                             <span>Verso</span>
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                         </div>
//                                     </div>

//                                     <div className="space-y-4">
//                                         <h3 className="font-semibold text-lg text-gray-900">Localité Souhaité </h3>
//                                         <div className="space-y-2">


//                                             <div>
//                                                 <span className="text-sm text-gray-500">Localité:</span>
//                                                 <p className="font-medium">{demande?.localite?.nom}</p>
//                                             </div>
//                                             <div className="space-y-4">
//                                                 <div>
//                                                     <span className="text-sm text-gray-500">Nom:</span>
//                                                     <p className="font-medium">{demande?.localite.nom} </p>
//                                                 </div>

//                                                 <div>
//                                                     <span className="text-sm text-gray-500">Description :</span>
//                                                     <p className="font-medium">{demande?.localite.description} </p>
//                                                 </div>
//                                                 <div>
//                                                     <span className="text-sm text-gray-500">Prix :</span>
//                                                     <p className="font-medium"> {formatPrice(demande.localite.prix)} </p>
//                                                 </div>

//                                                 <div>
//                                                     <span className="text-sm text-gray-500">Coordonnées :</span>
//                                                     <p className="font-medium"> {formatCoordinates(demande.localite.latitude, demande.localite.longitude)} </p>
//                                                 </div>
//                                                 {demande.localite.longitude && demande.localite.latitude && <MapCar selectedItem={demande.localite} type="localite" />}
//                                             </div>


//                                         </div>
//                                     </div>

//                                     <div className="space-y-4">
//                                         <h3 className="font-semibold text-lg text-gray-900">Spécifications</h3>
//                                         <div className="space-y-2">
//                                             <div>
//                                                 <span className="text-sm text-gray-500">Superficie souhaitée:</span>
//                                                 <p className="font-medium">{demande?.superficie} m²</p>
//                                             </div>
//                                             <div>
//                                                 <span className="text-sm text-gray-500">Usage prévu:</span>
//                                                 <p className="font-medium">{demande?.usagePrevu}</p>
//                                             </div>
//                                             <div>
//                                                 <span className="text-sm text-gray-500">Possède autre terrain:</span>
//                                                 <p className="font-medium">
//                                                     {demande?.possedeAutreTerrain ? "Oui" : "Non"}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                     </div>

//                                 </div>
//                             </div>

//                             <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                                 {/* Informations du document */}
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Référence</label>
//                                         <input
//                                             type="text"
//                                             value={formData.document.reference}
//                                             onChange={(e) => setFormData(prev => ({
//                                                 ...prev,
//                                                 document: { ...prev.document, reference: e.target.value }
//                                             }))}
//                                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Date de délivrance</label>
//                                         <input
//                                             type="date"
//                                             value={formData.document.dateDelivrance}
//                                             onChange={(e) => setFormData(prev => ({
//                                                 ...prev,
//                                                 document: { ...prev.document, dateDelivrance: e.target.value }
//                                             }))}
//                                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Lieu de signature</label>
//                                         <input
//                                             type="text"
//                                             value={formData.document.lieuSignature}
//                                             onChange={(e) => setFormData(prev => ({
//                                                 ...prev,
//                                                 document: { ...prev.document, lieuSignature: e.target.value }
//                                             }))}
//                                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Informations sur la parcelle */}
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Lotissement</label>
//                                         <select
//                                             value={selectedLotissement}
//                                             onChange={(e) => handleLotissementChange(e.target.value)}
//                                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                             required
//                                         >
//                                             <option value="">Sélectionner un lotissement</option>
//                                             {lotissements.map(lotissement => (
//                                                 <option key={lotissement.id} value={lotissement.id}>
//                                                     {lotissement.nom}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Parcelle</label>
//                                         <select
//                                             value={formData.parcelle.numero}
//                                             onChange={(e) => setFormData(prev => ({
//                                                 ...prev,
//                                                 parcelle: { ...prev.parcelle, numero: e.target.value }
//                                             }))}
//                                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                             required
//                                             disabled={!selectedLotissement}
//                                         >
//                                             <option value="">Sélectionner une parcelle</option>
//                                             {parcelles.map(parcelle => (
//                                                 <option key={parcelle.id} value={parcelle.numero}>
//                                                     Parcelle {parcelle.numero}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Référence cadastrale</label>
//                                         <input
//                                             type="text"
//                                             value={formData.parcelle.referenceCadastrale}
//                                             onChange={(e) => setFormData(prev => ({
//                                                 ...prev,
//                                                 parcelle: { ...prev.parcelle, referenceCadastrale: e.target.value }
//                                             }))}
//                                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Information CNI */}
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Numéro CNI</label>
//                                         <input
//                                             type="text"
//                                             value={formData.beneficiaire.cni.numero}
//                                             onChange={(e) => setFormData(prev => ({
//                                                 ...prev,
//                                                 beneficiaire: {
//                                                     ...prev.beneficiaire,
//                                                     cni: { ...prev.beneficiaire.cni, numero: e.target.value }
//                                                 }
//                                             }))}
//                                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                             required
//                                             placeholder="Ex: 1 548 1988 06765"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Date délivrance CNI</label>
//                                         <input
//                                             type="date"
//                                             value={formData.beneficiaire.cni.dateDelivrance}
//                                             onChange={(e) => setFormData(prev => ({
//                                                 ...prev,
//                                                 beneficiaire: {
//                                                     ...prev.beneficiaire,
//                                                     cni: { ...prev.beneficiaire.cni, dateDelivrance: e.target.value }
//                                                 }
//                                             }))}
//                                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Lieu délivrance CNI</label>
//                                         <input
//                                             type="text"
//                                             value={formData.beneficiaire.cni.lieuDelivrance}
//                                             onChange={(e) => setFormData(prev => ({
//                                                 ...prev,
//                                                 beneficiaire: {
//                                                     ...prev.beneficiaire,
//                                                     cni: { ...prev.beneficiaire.cni, lieuDelivrance: e.target.value }
//                                                 }
//                                             }))}
//                                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 {demande?.typeDemande === "PROPOSITION_BAIL" && (
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700">Type de bail</label>
//                                             <select
//                                                 value={formData.propositionBail?.typeBail}
//                                                 onChange={(e) => setFormData(prev => ({
//                                                     ...prev,
//                                                     propositionBail: { ...prev.propositionBail, typeBail: e.target.value }
//                                                 }))}
//                                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                                 required
//                                             >
//                                                 <option value="">Sélectionner le type</option>
//                                                 <option value="COMMERCIAL">Commercial</option>
//                                                 <option value="HABITATION">Habitation</option>
//                                             </select>
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700">Durée (années)</label>
//                                             <input
//                                                 type="number"
//                                                 value={formData.propositionBail?.duree}
//                                                 onChange={(e) => setFormData(prev => ({
//                                                     ...prev,
//                                                     propositionBail: { ...prev.propositionBail, duree: e.target.value }
//                                                 }))}
//                                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                                 required
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700">Montant location</label>
//                                             <input
//                                                 type="number"
//                                                 value={formData.propositionBail?.montantLocation}
//                                                 onChange={(e) => setFormData(prev => ({
//                                                     ...prev,
//                                                     propositionBail: { ...prev.propositionBail, montantLocation: e.target.value }
//                                                 }))}
//                                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                                 required
//                                             />
//                                         </div>
//                                     </div>
//                                 )}

//                                 {demande?.typeDemande === "BAIL_COMMUNAL" && (
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700">Montant location</label>
//                                             <input
//                                                 type="number"
//                                                 value={formData.montantLocation}
//                                                 onChange={(e) => setFormData(prev => ({
//                                                     ...prev,
//                                                     montantLocation: e.target.value
//                                                 }))}
//                                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                                 required
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700">Date début</label>
//                                             <input
//                                                 type="date"
//                                                 value={formData.dateDebut}
//                                                 onChange={(e) => setFormData(prev => ({
//                                                     ...prev,
//                                                     dateDebut: e.target.value
//                                                 }))}
//                                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                                 required
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700">Date fin</label>
//                                             <input
//                                                 type="date"
//                                                 value={formData.dateFin}
//                                                 onChange={(e) => setFormData(prev => ({
//                                                     ...prev,
//                                                     dateFin: e.target.value
//                                                 }))}
//                                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                                 required
//                                             />
//                                         </div>
//                                     </div>
//                                 )}

//                                 {demande?.typeDemande === "PERMIS_OCCUPATION" && (
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700">Durée de validité</label>
//                                             <input
//                                                 type="number"
//                                                 value={formData.dureeValidite}
//                                                 onChange={(e) => setFormData(prev => ({
//                                                     ...prev,
//                                                     dureeValidite: e.target.value
//                                                 }))}
//                                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                                 required
//                                                 placeholder="En années"
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700">Usage prévu</label>
//                                             <select
//                                                 value={formData.parcelle.usage}
//                                                 onChange={(e) => setFormData(prev => ({
//                                                     ...prev,
//                                                     parcelle: { ...prev.parcelle, usage: e.target.value }
//                                                 }))}
//                                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//                                                 required
//                                             >
//                                                 <option value="">Sélectionner l'usage</option>
//                                                 <option value="HABITATION">Habitation</option>
//                                                 <option value="COMMERCIAL">Commercial</option>
//                                                 <option value="MIXTE">Mixte</option>
//                                             </select>
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div className="flex justify-end space-x-4">
//                                     <button
//                                         type="button"
//                                         onClick={() => navigate(-1)}
//                                         className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                                     >
//                                         Annuler
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
//                                         disabled={isSubmitting}
//                                     >
//                                         {isSubmitting ? <Loader2 className="mr-1 animate-spin" /> : <Save className="mr-1" />}
//                                         Générer le document
//                                     </button>
//                                 </div>
//                             </form>

//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Ajouter le modal du viewer à la fin du composant, avant le dernier </> */}
//             {isViewerOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white p-4 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-2xl font-bold text-gray-800">
//                                 Document {viewType === 'recto' ? 'Recto' : 'Verso'}
//                             </h2>
//                             <button
//                                 onClick={closeViewer}
//                                 className="text-gray-500 hover:text-gray-700"
//                             >
//                                 Fermer
//                             </button>
//                         </div>
//                         <div className="bg-gray-200 rounded-lg p-4">
//                             {fileLoading ? (
//                                 <div className="flex justify-center items-center h-[600px]">
//                                     <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
//                                     <span className="ml-2 text-lg font-semibold text-gray-700">
//                                         Chargement du document...
//                                     </span>
//                                 </div>
//                             ) : activeDocument ? (
//                                 <iframe
//                                     src={`data:application/pdf;base64,${activeDocument}`}
//                                     width="100%"
//                                     height="600px"
//                                     title="Document PDF"
//                                     className="border rounded"
//                                 />
//                             ) : (
//                                 <div className="flex justify-center items-center h-[600px]">
//                                     <span className="text-lg font-semibold text-gray-700">
//                                         Document non disponible
//                                     </span>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default AdminDemandeConfirmation;






"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AdminBreadcrumb } from "@/components"
import { toast } from "sonner"
import { generateDocument, getDemandeDetails, getFileDocument } from "@/services/demandeService"
import { getLocaliteDtailsConfirmation } from "@/services/localiteService"
import MapCar from "../../Map/MapCar"
import { formatCoordinates, formatPhoneNumber, formatPrice } from "@/utils/formatters"
import {
    Layout,
    Card,
    Typography,
    Tag,
    Descriptions,
    Button,
    Form,
    Input,
    Select,
    DatePicker,
    Row,
    Col,
    Divider,
    Space,
    Spin,
    Modal,
    Empty,
    Grid,
} from "antd"
import {
    SaveOutlined,
    FileTextOutlined,
    LoadingOutlined,
    EnvironmentOutlined,
    UserOutlined,
    AreaChartOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"

const { Content } = Layout
const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input
const { useBreakpoint } = Grid

const AdminDemandeConfirmation = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const screens = useBreakpoint()

    const [localite, setLocalite] = useState({})
    const [lotissements, setLotissements] = useState([])
    const [lots, setLots] = useState([])
    const [selectedLotissement, setSelectedLotissement] = useState("")
    const [parcelles, setParcelles] = useState([])
    const [demande, setDemande] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Document viewer states
    const [isViewerOpen, setIsViewerOpen] = useState(false)
    const [fileLoading, setFileLoading] = useState(false)
    const [activeDocument, setActiveDocument] = useState(null)
    const [viewType, setViewType] = useState(null)

    const [formData, setFormData] = useState({
        // Document information
        document: {
            type: "PERMIS_OCCUPER",
            reference: `N° C.KL/SG/DDPF ${new Date().getFullYear()}`,
            dateDelivrance: new Date().toISOString().split("T")[0],
            lieuSignature: "Kaolack",
        },

        // Administrative information
        administration: {
            pays: "République du Sénégal",
            region: "Kaolack",
            commune: "Kaolack",
            ampliations: ["S.G", "DDPF", "Intéressé", "Archives", "Cadastre", "Domaine"],
        },

        // Beneficiary information
        beneficiaire: {
            prenom: "",
            nom: "",
            dateNaissance: "",
            lieuNaissance: "",
            cni: {
                numero: "",
                dateDelivrance: "",
                lieuDelivrance: "",
            },
        },

        // Plot information
        parcelle: {
            lotissement: "",
            numero: "",
            superficie: "",
            usage: "",
            referenceCadastrale: "T.F...912... (propriété de la Commune de Kaolack)",
        },
    })

    // Handle document viewing
    const handleViewDocument = async (type) => {
        try {
            setFileLoading(true)
            setViewType(type)
            setIsViewerOpen(true)

            // Get file from service
            const fileData = await getFileDocument(id)
            const document = type === "recto" ? fileData.recto : fileData.verso
            setActiveDocument(document)
        } catch (error) {
            console.error("Erreur lors du chargement du document:", error)
            toast.error("Erreur lors du chargement du document")
        } finally {
            setFileLoading(false)
        }
    }

    // Close document viewer
    const closeViewer = () => {
        setIsViewerOpen(false)
        setActiveDocument(null)
        setViewType(null)
    }

    useEffect(() => {
        const fetchDetailsLocalite = async () => {
            try {
                const data = await getLocaliteDtailsConfirmation(id)
                setLocalite(data)
                setLotissements(data.lotissements)
            } catch (error) {
                toast.error("Erreur lors du chargement des lotissements")
            }
        }
        fetchDetailsLocalite()
    }, [id])

    useEffect(() => {
        const fetchDemande = async () => {
            try {
                const data = await getDemandeDetails(id)
                setDemande(data)

                // Set form data based on request details
                setFormData((prev) => ({
                    ...prev,
                    superficie: data.superficie,
                    usagePrevu: data.usagePrevu,
                    localite: data.localite?.nom || "",
                    localiteId: data.localite?.id || null,
                    numeroPermis:
                        data.typeDemande === "BAIL_COMMUNAL"
                            ? `BC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
                            : `PO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
                    dateFin:
                        data.typeDemande === "BAIL_COMMUNAL"
                            ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]
                            : "",
                    adresseTerrain: data.localite?.nom || "",
                }))

                // Set form values
                form.setFieldsValue({
                    "document.reference": formData.document.reference,
                    "document.dateDelivrance": dayjs(formData.document.dateDelivrance),
                    "document.lieuSignature": formData.document.lieuSignature,
                    "parcelle.referenceCadastrale": formData.parcelle.referenceCadastrale,
                })
            } catch (error) {
                toast.error("Erreur lors du chargement de la demande")
            } finally {
                setLoading(false)
            }
        }

        fetchDemande()
    }, [id, form])

    const handleLotissementChange = async (lotissementId) => {
        try {
            if (!lotissementId) {
                setParcelles([])
                setSelectedLotissement("")
                return
            }
            setSelectedLotissement(lotissementId)

            const lotissement = lotissements.find((lot) => lot.id === Number(lotissementId))

            if (!lotissement) {
                toast.error("Lotissement non trouvé")
                setParcelles([])
                return
            }

            setParcelles(lotissement.parcelles || [])

            setFormData((prev) => ({
                ...prev,
                lotissement: lotissement.nom,
                propositionBail: {
                    ...prev.propositionBail,
                    lotissement: lotissement.nom,
                },
            }))
        } catch (error) {
            console.error("Erreur lors du changement de lotissement:", error)
            toast.error("Erreur lors du chargement des parcelles")
            setParcelles([])
        }
    }

    const validateFormData = (data, type) => {
        const commonValidation =
            data.document?.reference && data.document?.dateDelivrance && data.document?.lieuSignature && data.parcelle?.numero

        switch (type) {
            case "PROPOSITION_BAIL":
                return (
                    commonValidation &&
                    data.propositionBail?.typeBail &&
                    data.propositionBail?.duree &&
                    data.propositionBail?.montantLocation
                )

            case "BAIL_COMMUNAL":
                return commonValidation && data.montantLocation && data.dateDebut && data.dateFin

            case "PERMIS_OCCUPATION":
                return commonValidation && data.dureeValidite && data.parcelle?.usage

            default:
                return false
        }
    }

    const handleSubmit = async (values) => {
        setIsSubmitting(true)
        try {
            let dataToSubmit = {
                demande: id,
                typeDemande: demande?.typeDemande,
            }

            // Common data structure for all document types
            const commonData = {
                dateDelivrance: formData.document.dateDelivrance,
                superficie: Number(demande?.superficie) || 0,
                demandeId: demande?.id,
                usagePrevu: demande?.usagePrevu || "",
                localite: demande?.localite?.nom || "",
                referenceCadastrale: formData.parcelle.referenceCadastrale,
                lotissement: lotissements.find((lot) => lot.id === Number(selectedLotissement))?.nom || "",
                numeroParcelle: formData.parcelle.numero,
                cni: {
                    numero: formData.beneficiaire.cni.numero,
                    dateDelivrance: formData.beneficiaire.cni.dateDelivrance,
                    lieuDelivrance: formData.beneficiaire.cni.lieuDelivrance,
                },
                beneficiaire: {
                    prenom: demande?.demandeur?.prenom || "",
                    nom: demande?.demandeur?.nom || "",
                    dateNaissance: demande?.demandeur?.dateNaissance || "",
                    lieuNaissance: demande?.demandeur?.lieuNaissance || "",
                },
            }

            switch (demande?.typeDemande) {
                case "PERMIS_OCCUPATION":
                    dataToSubmit = {
                        ...dataToSubmit,
                        ...commonData,
                        numeroPermis: `PO-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
                        dureeValidite: `${formData.dureeValidite} an${formData.dureeValidite > 1 ? "s" : ""}`,
                        usage: formData.parcelle.usage,
                    }
                    break

                case "BAIL_COMMUNAL":
                    dataToSubmit = {
                        ...dataToSubmit,
                        ...commonData,
                        numeroBail: `BC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
                        montantLocation: Number(formData.montantLocation),
                        montantCaution: Number(formData.montantLocation) * 3,
                        dateDebut: formData.dateDebut,
                        dateFin: formData.dateFin,
                    }
                    break

                case "PROPOSITION_BAIL":
                    dataToSubmit = {
                        ...dataToSubmit,
                        ...commonData,
                        propositionBail: {
                            reference: `PB-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
                            typeBail: formData.propositionBail?.typeBail,
                            duree: `${formData.propositionBail?.duree} an${formData.propositionBail?.duree > 1 ? "s" : ""}`,
                            montantLocation: Number(formData.propositionBail?.montantLocation),
                            montantCaution: Number(formData.propositionBail?.montantLocation) * 3,
                        },
                    }
                    break

                default:
                    throw new Error("Type de document non supporté")
            }

            if (!validateFormData(dataToSubmit, demande?.typeDemande)) {
                toast.error("Veuillez remplir tous les champs obligatoires")
                return
            }

            await generateDocument(id, dataToSubmit)
            toast.success("Document généré avec succès")
            navigate(`/admin/demandes/${id}/details`)
        } catch (error) {
            console.error("Erreur lors de la génération:", error)
            toast.error("Erreur lors de la génération du document")
        } finally {
            setIsSubmitting(false)
        }
    }

    const getRequestTypeTag = (type) => {
        switch (type) {
            case "PERMIS_OCCUPATION":
                return <Tag color="success">Permis d'Occupation</Tag>
            case "BAIL_COMMUNAL":
                return <Tag color="processing">Bail Communal</Tag>
            case "PROPOSITION_BAIL":
                return <Tag color="warning">Proposition de Bail</Tag>
            default:
                return <Tag>Inconnu</Tag>
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Chargement..." />
            </div>
        )
    }

    return (
        <>
            <AdminBreadcrumb title="Confirmation de la demande" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <Content style={{ padding: "24px" }}>
                                <Card
                                    title={
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Title level={4}>Confirmation de la demande #{id}</Title>
                                            {getRequestTypeTag(demande?.typeDemande)}
                                        </div>
                                    }
                                >
                                    <Divider orientation="left">Informations de la demande</Divider>

                                    <Row gutter={[24, 24]}>
                                        {/* Requester Information */}
                                        <Col xs={24} md={12} lg={6}>
                                            <Card
                                                title={
                                                    <span>
                                                        <UserOutlined /> Informations du demandeur
                                                    </span>
                                                }
                                                size="small"
                                                bordered={false}
                                                style={{ height: "100%" }}
                                            >
                                                <Descriptions column={1} size="small">
                                                    <Descriptions.Item label="Nom complet">
                                                        {demande?.demandeur?.prenom} {demande?.demandeur?.nom}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Email">
                                                        <Text ellipsis>{demande?.demandeur?.email}</Text>
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Téléphone">
                                                        {formatPhoneNumber(demande?.demandeur?.telephone)}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Adresse">{demande?.demandeur?.adresse}</Descriptions.Item>
                                                    <Descriptions.Item label="Date de naissance">
                                                        {demande?.demandeur?.dateNaissance
                                                            ? dayjs(demande.demandeur.dateNaissance).format("DD/MM/YYYY")
                                                            : "Non renseigné"}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Lieu de naissance">
                                                        {demande?.demandeur?.lieuNaissance || "Non renseigné"}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Profession">
                                                        {demande?.demandeur?.profession || "Non renseigné"}
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </Card>
                                        </Col>

                                        {/* Request Details */}
                                        <Col xs={24} md={12} lg={6}>
                                            <Card
                                                title={
                                                    <span>
                                                        <FileTextOutlined /> Détails de la demande
                                                    </span>
                                                }
                                                size="small"
                                                bordered={false}
                                                style={{ height: "100%" }}
                                            >
                                                <Descriptions column={1} size="small">
                                                    <Descriptions.Item label="Date de soumission">
                                                        {dayjs(demande?.dateCreation).format("DD/MM/YYYY")}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Type de demande">
                                                        {demande?.typeDemande === "PERMIS_OCCUPATION"
                                                            ? "Permis d'Occupation"
                                                            : demande?.typeDemande === "BAIL_COMMUNAL"
                                                                ? "Bail Communal"
                                                                : "Proposition de Bail"}
                                                    </Descriptions.Item>
                                                </Descriptions>

                                                <Divider orientation="left" plain style={{ margin: "12px 0" }}>
                                                    <small>Documents d'identification</small>
                                                </Divider>

                                                <Space direction="vertical" style={{ width: "100%" }}>
                                                    <Button type="link" icon={<FileTextOutlined />} onClick={() => handleViewDocument("recto")}>
                                                        Recto
                                                    </Button>
                                                    <Button type="link" icon={<FileTextOutlined />} onClick={() => handleViewDocument("verso")}>
                                                        Verso
                                                    </Button>
                                                </Space>
                                            </Card>
                                        </Col>

                                        {/* Locality Information */}
                                        <Col xs={24} md={12} lg={6}>
                                            <Card
                                                title={
                                                    <span>
                                                        <EnvironmentOutlined /> Localité Souhaitée
                                                    </span>
                                                }
                                                size="small"
                                                bordered={false}
                                                style={{ height: "100%" }}
                                            >
                                                <Descriptions column={1} size="small">
                                                    <Descriptions.Item label="Nom">{demande?.localite?.nom}</Descriptions.Item>
                                                    <Descriptions.Item label="Description">
                                                        <Text ellipsis>{demande?.localite?.description}</Text>
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Prix">{formatPrice(demande?.localite?.prix)}</Descriptions.Item>
                                                    <Descriptions.Item label="Coordonnées">
                                                        {formatCoordinates(demande?.localite?.latitude, demande?.localite?.longitude)}
                                                    </Descriptions.Item>
                                                </Descriptions>

                                                {demande?.localite?.longitude && demande?.localite?.latitude && (
                                                    <div style={{ marginTop: 12 }}>
                                                        <MapCar selectedItem={demande.localite} type="localite" />
                                                    </div>
                                                )}
                                            </Card>
                                        </Col>

                                        {/* Specifications */}
                                        <Col xs={24} md={12} lg={6}>
                                            <Card
                                                title={
                                                    <span>
                                                        <AreaChartOutlined /> Spécifications
                                                    </span>
                                                }
                                                size="small"
                                                bordered={false}
                                                style={{ height: "100%" }}
                                            >
                                                <Descriptions column={1} size="small">
                                                    <Descriptions.Item label="Superficie souhaitée">{demande?.superficie} m²</Descriptions.Item>
                                                    <Descriptions.Item label="Usage prévu">{demande?.usagePrevu}</Descriptions.Item>
                                                    <Descriptions.Item label="Possède autre terrain">
                                                        {demande?.possedeAutreTerrain ? "Oui" : "Non"}
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Divider orientation="left">Formulaire de confirmation</Divider>

                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={handleSubmit}
                                        initialValues={{
                                            "document.reference": formData.document.reference,
                                            "document.lieuSignature": formData.document.lieuSignature,
                                            "parcelle.referenceCadastrale": formData.parcelle.referenceCadastrale,
                                        }}
                                    >
                                        <Row gutter={16}>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="document.reference"
                                                    label="Référence"
                                                    rules={[{ required: true, message: "Veuillez saisir la référence" }]}
                                                >
                                                    <Input
                                                        placeholder="Référence du document"
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                document: { ...prev.document, reference: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="document.dateDelivrance"
                                                    label="Date de délivrance"
                                                    rules={[{ required: true, message: "Veuillez sélectionner la date de délivrance" }]}
                                                >
                                                    <DatePicker
                                                        style={{ width: "100%" }}
                                                        format="DD/MM/YYYY"
                                                        onChange={(date, dateString) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                document: { ...prev.document, dateDelivrance: dateString },
                                                            }))
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="document.lieuSignature"
                                                    label="Lieu de signature"
                                                    rules={[{ required: true, message: "Veuillez saisir le lieu de signature" }]}
                                                >
                                                    <Input
                                                        placeholder="Lieu de signature"
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                document: { ...prev.document, lieuSignature: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row gutter={16}>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="lotissement"
                                                    label="Lotissement"
                                                    rules={[{ required: true, message: "Veuillez sélectionner un lotissement" }]}
                                                >
                                                    <Select
                                                        placeholder="Sélectionner un lotissement"
                                                        onChange={handleLotissementChange}
                                                        value={selectedLotissement}
                                                    >
                                                        <Option value="">Sélectionner un lotissement</Option>
                                                        {lotissements.map((lotissement) => (
                                                            <Option key={lotissement.id} value={lotissement.id}>
                                                                {lotissement.nom}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="parcelle.numero"
                                                    label="Parcelle"
                                                    rules={[{ required: true, message: "Veuillez sélectionner une parcelle" }]}
                                                >
                                                    <Select
                                                        placeholder="Sélectionner une parcelle"
                                                        disabled={!selectedLotissement}
                                                        onChange={(value) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                parcelle: { ...prev.parcelle, numero: value },
                                                            }))
                                                        }
                                                        value={formData.parcelle.numero}
                                                    >
                                                        <Option value="">Sélectionner une parcelle</Option>
                                                        {parcelles.map((parcelle) => (
                                                            <Option key={parcelle.id} value={parcelle.numero}>
                                                                Parcelle {parcelle.numero}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="parcelle.referenceCadastrale"
                                                    label="Référence cadastrale"
                                                    rules={[{ required: true, message: "Veuillez saisir la référence cadastrale" }]}
                                                >
                                                    <Input
                                                        placeholder="Référence cadastrale"
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                parcelle: { ...prev.parcelle, referenceCadastrale: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row gutter={16}>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="beneficiaire.cni.numero"
                                                    label="Numéro CNI"
                                                    rules={[{ required: true, message: "Veuillez saisir le numéro CNI" }]}
                                                >
                                                    <Input
                                                        placeholder="Ex: 1 548 1988 06765"
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                beneficiaire: {
                                                                    ...prev.beneficiaire,
                                                                    cni: { ...prev.beneficiaire.cni, numero: e.target.value },
                                                                },
                                                            }))
                                                        }
                                                        value={formData.beneficiaire.cni.numero}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="beneficiaire.cni.dateDelivrance"
                                                    label="Date délivrance CNI"
                                                    rules={[{ required: true, message: "Veuillez sélectionner la date de délivrance CNI" }]}
                                                >
                                                    <DatePicker
                                                        style={{ width: "100%" }}
                                                        format="DD/MM/YYYY"
                                                        onChange={(date, dateString) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                beneficiaire: {
                                                                    ...prev.beneficiaire,
                                                                    cni: { ...prev.beneficiaire.cni, dateDelivrance: dateString },
                                                                },
                                                            }))
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="beneficiaire.cni.lieuDelivrance"
                                                    label="Lieu délivrance CNI"
                                                    rules={[{ required: true, message: "Veuillez saisir le lieu de délivrance CNI" }]}
                                                >
                                                    <Input
                                                        placeholder="Lieu de délivrance"
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                beneficiaire: {
                                                                    ...prev.beneficiaire,
                                                                    cni: { ...prev.beneficiaire.cni, lieuDelivrance: e.target.value },
                                                                },
                                                            }))
                                                        }
                                                        value={formData.beneficiaire.cni.lieuDelivrance}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        {demande?.typeDemande === "PROPOSITION_BAIL" && (
                                            <Row gutter={16}>
                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        name="propositionBail.typeBail"
                                                        label="Type de bail"
                                                        rules={[{ required: true, message: "Veuillez sélectionner le type de bail" }]}
                                                    >
                                                        <Select
                                                            placeholder="Sélectionner le type"
                                                            onChange={(value) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    propositionBail: { ...prev.propositionBail, typeBail: value },
                                                                }))
                                                            }
                                                            value={formData.propositionBail?.typeBail}
                                                        >
                                                            <Option value="">Sélectionner le type</Option>
                                                            <Option value="COMMERCIAL">Commercial</Option>
                                                            <Option value="HABITATION">Habitation</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        name="propositionBail.duree"
                                                        label="Durée (années)"
                                                        rules={[{ required: true, message: "Veuillez saisir la durée" }]}
                                                    >
                                                        <Input
                                                            type="number"
                                                            placeholder="Durée en années"
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    propositionBail: { ...prev.propositionBail, duree: e.target.value },
                                                                }))
                                                            }
                                                            value={formData.propositionBail?.duree}
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        name="propositionBail.montantLocation"
                                                        label="Montant location"
                                                        rules={[{ required: true, message: "Veuillez saisir le montant de location" }]}
                                                    >
                                                        <Input
                                                            type="number"
                                                            placeholder="Montant en FCFA"
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    propositionBail: { ...prev.propositionBail, montantLocation: e.target.value },
                                                                }))
                                                            }
                                                            value={formData.propositionBail?.montantLocation}
                                                            suffix="FCFA"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )}

                                        {demande?.typeDemande === "BAIL_COMMUNAL" && (
                                            <Row gutter={16}>
                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        name="montantLocation"
                                                        label="Montant location"
                                                        rules={[{ required: true, message: "Veuillez saisir le montant de location" }]}
                                                    >
                                                        <Input
                                                            type="number"
                                                            placeholder="Montant en FCFA"
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    montantLocation: e.target.value,
                                                                }))
                                                            }
                                                            value={formData.montantLocation}
                                                            suffix="FCFA"
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        name="dateDebut"
                                                        label="Date début"
                                                        rules={[{ required: true, message: "Veuillez sélectionner la date de début" }]}
                                                    >
                                                        <DatePicker
                                                            style={{ width: "100%" }}
                                                            format="DD/MM/YYYY"
                                                            onChange={(date, dateString) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    dateDebut: dateString,
                                                                }))
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        name="dateFin"
                                                        label="Date fin"
                                                        rules={[{ required: true, message: "Veuillez sélectionner la date de fin" }]}
                                                    >
                                                        <DatePicker
                                                            style={{ width: "100%" }}
                                                            format="DD/MM/YYYY"
                                                            onChange={(date, dateString) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    dateFin: dateString,
                                                                }))
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )}

                                        {demande?.typeDemande === "PERMIS_OCCUPATION" && (
                                            <Row gutter={16}>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        name="dureeValidite"
                                                        label="Durée de validité"
                                                        rules={[{ required: true, message: "Veuillez saisir la durée de validité" }]}
                                                    >
                                                        <Input
                                                            type="number"
                                                            placeholder="En années"
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    dureeValidite: e.target.value,
                                                                }))
                                                            }
                                                            value={formData.dureeValidite}
                                                            suffix="an(s)"
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        name="parcelle.usage"
                                                        label="Usage prévu"
                                                        rules={[{ required: true, message: "Veuillez sélectionner l'usage prévu" }]}
                                                    >
                                                        <Select
                                                            placeholder="Sélectionner l'usage"
                                                            onChange={(value) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    parcelle: { ...prev.parcelle, usage: value },
                                                                }))
                                                            }
                                                            value={formData.parcelle.usage}
                                                        >
                                                            <Option value="">Sélectionner l'usage</Option>
                                                            <Option value="HABITATION">Habitation</Option>
                                                            <Option value="COMMERCIAL">Commercial</Option>
                                                            <Option value="MIXTE">Mixte</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )}

                                        <Form.Item>
                                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
                                                <Button onClick={() => navigate(-1)}>Annuler</Button>
                                                <Button className="text-primary" htmlType="submit" loading={isSubmitting} icon={<SaveOutlined />}>
                                                    Générer le document
                                                </Button>
                                            </div>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </Content>
                        </div>
                    </div>
                </div>
            </section>
            {/* Document viewer modal */}
            <Modal
                title={`Document ${viewType === "recto" ? "Recto" : "Verso"}`}
                open={isViewerOpen}
                onCancel={closeViewer}
                footer={null}
                width="80%"
                style={{ top: 20 }}
                bodyStyle={{ padding: "12px", height: "70vh" }}
            >
                {fileLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Chargement du document..." />
                    </div>
                ) : activeDocument ? (

                    <iframe
                        src={`data:application/pdf;base64,${activeDocument}`}
                        width="100%"
                        height="100%"
                        title="Document PDF"
                        className="border rounded"
                        style={{ border: "none" }}
                    />
                ) : (
                    <Empty description="Document non disponible" />
                )}
            </Modal>
        </>
    )
}

export default AdminDemandeConfirmation

