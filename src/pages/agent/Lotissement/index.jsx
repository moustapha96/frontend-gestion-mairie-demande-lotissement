// "use client";

// import { LuSearch, LuChevronLeft, LuChevronRight, LuFileText, LuPlus, LuPlusSquare, LuX } from "react-icons/lu";
// import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { cn } from "@/utils";
// import { getLotissements, updateLotissementStatut } from "@/services/lotissementService";
// import { useAuthContext } from "@/context";
// import { Badge, BadgeCent, BadgePlusIcon, Edit2, File, Loader2, Save } from "lucide-react";
// import { BadgeAlert, Eye } from "lucide";
// import { FaEye } from "react-icons/fa";
// import { toast } from "sonner";
// import { createLot } from "@/services/lotsService";
// import { createPlanLotissement } from "@/services/planLotissement";

// const AgentLotissementListe = () => {
//     const { user } = useAuthContext();
//     const [lotissements, setLotissements] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [filter, setFilter] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(5);
//     const [modalOpen, setModalOpen] = useState(false)
//     const [file, setFile] = useState(null);
//     const [formData, setFormData] = useState({
//         numeroLot: "",
//         superficie: "",
//         statut: "DISPONIBLE", // Valeur par défaut
//         prix: "",
//         usage: "",
//         lotissementId: "",
//         lotissementNom: ""
//     })
//     // Ajoutez ces états
//     const [planModalOpen, setPlanModalOpen] = useState(false);
//     const [planFormData, setPlanFormData] = useState({
//         description: "",
//         version: "",
//         lotissementId: null,
//         lotissementNom: ""
//     });
//     const [planFile, setPlanFile] = useState(null);

//     useEffect(() => {
//         fetchLotissements();
//     }, [user.id]);

//     const fetchLotissements = async () => {
//         try {
//             const data = await getLotissements();
//             console.log(data);
//             setLotissements(data);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // if (loading) return <div className="flex justify-center items-center h-screen">Chargement des lotissements...</div>;
//     if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>;

//     const filteredLotissements = lotissements.filter(
//         (lotissement) =>
//             lotissement.nom.toLowerCase().includes(filter.toLowerCase()) ||
//             lotissement.description.toLowerCase().includes(filter.toLowerCase())
//     );

//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = filteredLotissements.slice(indexOfFirstItem, indexOfLastItem);

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     const handleFileView = (filePath) => {
//         window.open(filePath, "_blank");
//     };


//     const handleUpdateStatut = async (lotissementId, nouveauStatut) => {
//         try {
//             await updateLotissementStatut(lotissementId, nouveauStatut);
//             // Mise à jour locale des données
//             const updatedLotissements = lotissements.map(lotissement => {
//                 if (lotissement.id === lotissementId) {
//                     return { ...lotissement, statut: nouveauStatut };
//                 }
//                 return lotissement;
//             });
//             setLotissements(updatedLotissements);
//             toast.success("Statut mis à jour avec succès");
//         } catch (error) {
//             toast.error("Erreur lors de la mise à jour du statut");
//         }
//     };


//     const handleOpenModal = (lotissement) => {
//         setFormData({
//             numeroLot: "",
//             superficie: "",
//             statut: "DISPONIBLE",
//             prix: "",
//             usage: "",
//             lotissementId: lotissement.id,
//             lotissementNom: lotissement.nom
//         })
//         setModalOpen(true)
//     }

//     const handleCloseModal = () => {
//         setModalOpen(false)
//         setFormData({ numeroLot: "", superficie: "", statut: "", prix: "", usage: "", lotissementId: null })
//     }
//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         try {
//             console.log(formData)
//             await createLot(formData)
//             toast.success("Lot ajouté avec succès")
//             fetchLotissements();
//             handleCloseModal()
//         } catch (error) {
//             toast.error("Erreur lors de l'ajout ou de la modification du lot")
//         }
//     }

//     const handleInputChange = (e) => {
//         const { name, value } = e.target
//         setFormData((prev) => ({ ...prev, [name]: value }))
//     }

//     // fonction pour ajouter plan

//     const handleOpenPlanModal = (lotissement) => {
//         setPlanFormData({
//             description: "",
//             version: "",
//             lotissementId: lotissement.id,
//             lotissementNom: lotissement.nom
//         });
//         setPlanFile(null);
//         setPlanModalOpen(true);
//     };

//     const handleClosePlanModal = () => {
//         setPlanModalOpen(false);
//         setPlanFormData({
//             description: "",
//             version: "",
//             lotissementId: null,
//             lotissementNom: ""
//         });
//         setPlanFile(null);
//     };

//     const handlePlanInputChange = (e) => {
//         const { name, value, files } = e.target;
//         if (name === "fichier") {
//             setPlanFile(files[0]);
//         } else {
//             setPlanFormData(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }
//     };

//     const handlePlanSubmit = async (e) => {
//         e.preventDefault();
//         if (!planFile) {
//             toast.error("Veuillez sélectionner un fichier");
//             return;
//         }

//         try {
//             const formData = new FormData();
//             formData.append("description", planFormData.description);
//             formData.append("version", planFormData.version);
//             formData.append("lotissementId", planFormData.lotissementId);
//             formData.append("document", planFile);

//             await createPlanLotissement(formData);
//             toast.success("Plan ajouté avec succès");
//             handleClosePlanModal();
//             fetchLotissements();
//         } catch (error) {
//             toast.error("Erreur lors de l'ajout du plan");
//         }
//     };

//     return (
//         <>
//             <AgentBreadcrumb title="Liste de Lotissements" />
//             <section>
//                 <div className="container">
//                     <div className="my-6 space-y-6">
//                         <div className="grid grid-cols-1">
//                             <div className="bg-white dark:bg-default-50 shadow-lg rounded-lg overflow-hidden">

//                                 <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//                                     <h4 className="text-xl font-semibold text-gray-800 dark:text-white uppercase">Liste des lotissements</h4>
//                                 </div>

//                                 <div className="flex items-center justify-end border-b gap-4 border-gray-200 px-6 py-4">
//                                     <Link
//                                         to="/agent/lotissements/nouveau"
//                                         className="text-primary flex items-center gap-2"
//                                     >
//                                         <LuPlusSquare className="mr-2" /> Ajouter
//                                     </Link>
//                                 </div>



//                                 <div className="p-6">
//                                     <div className="flex mb-4">
//                                         <div className="relative flex-1">
//                                             <input
//                                                 type="text"
//                                                 placeholder="Rechercher par nom ou description..."
//                                                 value={filter}
//                                                 onChange={(e) => setFilter(e.target.value)}
//                                                 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                                             />
//                                             <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                                         </div>
//                                     </div>


//                                     <div className="overflow-x-auto">
//                                         <table className="min-w-full divide-y divide-gray-200">
//                                             <thead className="bg-gray-50">
//                                                 <tr>
//                                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                         Localité
//                                                     </th>
//                                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                         Nom
//                                                     </th>
//                                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                         Localisation
//                                                     </th>
//                                                     {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                         Description
//                                                     </th> */}
//                                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                         Statut
//                                                     </th>
//                                                     {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                         Date de Création
//                                                     </th> */}
//                                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                         Lots
//                                                     </th>
//                                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                         Plans
//                                                     </th>
//                                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                         Actions
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody className="bg-white divide-y divide-gray-200">
//                                                 {currentItems.map((lotissement) => (
//                                                     <tr key={lotissement.id} className="hover:bg-gray-50 transition-colors duration-200">
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                             <Link to={`/agent/localites/${lotissement.localite.id}/details`}
//                                                                 className="text-primary hover:text-primary-700 transition-colors duration-200 flex justify-center items-center px-4 py-2 ">
//                                                                 {lotissement.localite.nom}
//                                                             </Link>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                             {lotissement.nom}
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lotissement.localisation}</td>
//                                                         {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lotissement.description}</td> */}
//                                                         <td className="px-6 py-4 whitespace-nowrap">

//                                                             <span
//                                                                 className={cn(
//                                                                     "text-sm border rounded-md py-1 px-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none",
//                                                                     {
//                                                                         'bg-green-100 text-green-800 border border-green-500': lotissement.statut === 'acheve',
//                                                                         'bg-red-100 text-red-800 border border-red-500': lotissement.statut === 'rejete',
//                                                                         'bg-yellow-100 text-yellow-500 border border-yellow-500': lotissement.statut === 'en_cours',
//                                                                         'bg-gray-100 text-gray-500 border border-gray-500': !lotissement.statut
//                                                                     }
//                                                                 )}>
//                                                                 {lotissement.statut}
//                                                             </span>
//                                                         </td>

//                                                         {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                             {new Date(lotissement.dateCreation).toLocaleDateString()}
//                                                         </td> */}

//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                             <div className="flex items-center space-x-2">
//                                                                 {lotissement.lots.length > 0 && <>
//                                                                     <Link
//                                                                         to={`/agent/lotissements/${lotissement.id}/lots`}
//                                                                         title="les lots"
//                                                                         className="text-primary hover:text-primary-700 transition-colors duration-200 flex justify-center items-center px-4 py-2 "
//                                                                     >
//                                                                         {lotissement.lots.length}  Lots
//                                                                     </Link>
//                                                                 </>}
//                                                                 {
//                                                                     lotissement.lots.length == 0 && <>
//                                                                         <button
//                                                                             onClick={() => handleOpenModal(lotissement)}
//                                                                             title="Ajouter un lot"
//                                                                             className="text-primary hover:text-primary-700 transition-colors duration-200 flex justify-center items-center px-4 py-2 "
//                                                                         >
//                                                                             Ajouter
//                                                                         </button>
//                                                                     </>
//                                                                 }

//                                                             </div>
//                                                         </td>

//                                                         {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                             <div className="flex items-center space-x-2">
//                                                                 {lotissement.planLotissements.length > 0 && <>

//                                                                     <Link
//                                                                         to={`/agent/lotissements/${lotissement.id}/plans`}
//                                                                         title="les plans"
//                                                                         className="text-primary hover:text-primary-700 transition-colors duration-200 flex justify-center items-center px-4 py-2 "
//                                                                     >
//                                                                         {lotissement.planLotissements.length} <File className="mr-2" />

//                                                                     </Link>
//                                                                 </>}
//                                                             </div>
//                                                         </td> */}
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                             <div className="flex items-center space-x-2">
//                                                                 {lotissement.planLotissements.length > 0 ? (
//                                                                     <Link
//                                                                         to={`/agent/lotissements/${lotissement.id}/plans`}
//                                                                         title="les plans"
//                                                                         className="text-primary hover:text-primary-700 transition-colors duration-200 flex justify-center items-center px-4 py-2"
//                                                                     >
//                                                                         {lotissement.planLotissements.length} <File className="ml-2" />
//                                                                     </Link>
//                                                                 ) : (
//                                                                     <button
//                                                                         onClick={() => handleOpenPlanModal(lotissement)}
//                                                                         title="Ajouter un plan"
//                                                                         className="text-primary hover:text-primary-700 transition-colors duration-200 flex items-center px-4 py-2"
//                                                                     >
//                                                                         <LuPlus className="mr-2" /> Plan
//                                                                     </button>
//                                                                 )}
//                                                             </div>
//                                                         </td>

//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                             <div className="flex items-center space-x-4 justify-between ">
//                                                                 <Link
//                                                                     to={`/agennt/lotissements/${lotissement.id}/details`}
//                                                                     title="Détails"
//                                                                     className="text-primary hover:text-primary-700 transition-colors duration-200"
//                                                                 >
//                                                                     <FaEye size={18} />
//                                                                 </Link>

//                                                                 <Link
//                                                                     to={`/agent/lotissements/${lotissement.id}/modification`}
//                                                                     title="Modification"
//                                                                     className="text-primary hover:text-primary-700 transition-colors duration-200"
//                                                                 >
//                                                                     <Edit2 size={18} />
//                                                                 </Link>


//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                             {loading && (
//                                                 <tbody className="w-full">
//                                                     <tr>
//                                                         <td colSpan="5" className="px-6 py-12">
//                                                             <div className="flex items-center justify-center">
//                                                                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 </tbody>
//                                             )}
//                                         </table>
//                                     </div>

//                                     <div className="flex items-center justify-between mt-4">
//                                         <div className="text-sm text-gray-700">
//                                             Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredLotissements.length)} sur{" "}
//                                             {filteredLotissements.length} entrées
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <button
//                                                 onClick={() => paginate(currentPage - 1)}
//                                                 disabled={currentPage === 1}
//                                                 className={cn(
//                                                     "px-3 py-1 rounded-md",
//                                                     currentPage === 1
//                                                         ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                                         : "bg-white text-gray-700 hover:bg-gray-50"
//                                                 )}
//                                             >
//                                                 <LuChevronLeft className="h-5 w-5" />
//                                             </button>
//                                             {Array.from({ length: Math.ceil(filteredLotissements.length / itemsPerPage) }).map((_, index) => (
//                                                 <button
//                                                     key={index}
//                                                     onClick={() => paginate(index + 1)}
//                                                     className={cn(
//                                                         "px-3 py-1 rounded-md",
//                                                         currentPage === index + 1 ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"
//                                                     )}
//                                                 >
//                                                     {index + 1}
//                                                 </button>
//                                             ))}
//                                             <button
//                                                 onClick={() => paginate(currentPage + 1)}
//                                                 disabled={currentPage === Math.ceil(filteredLotissements.length / itemsPerPage)}
//                                                 className={cn(
//                                                     "px-3 py-1 rounded-md",
//                                                     currentPage === Math.ceil(filteredLotissements.length / itemsPerPage)
//                                                         ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                                         : "bg-white text-gray-700 hover:bg-gray-50"
//                                                 )}
//                                             >
//                                                 <LuChevronRight className="h-5 w-5" />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section >
//             {modalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
//                         <div className="flex justify-between items-center mb-6 border-b pb-4">
//                             <div>
//                                 <h3 className="text-lg font-semibold text-gray-900">
//                                     Ajouter un Lot
//                                 </h3>
//                                 <p className="text-sm text-gray-500 mt-1">
//                                     Lotissement: {formData.lotissementNom}
//                                 </p>
//                             </div>
//                             <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
//                                 <LuX className="h-6 w-6" />
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label htmlFor="numeroLot" className="block text-sm font-medium text-gray-700">
//                                         Numéro du Lot*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="numeroLot"
//                                         name="numeroLot"
//                                         value={formData.numeroLot}
//                                         onChange={handleInputChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label htmlFor="superficie" className="block text-sm font-medium text-gray-700">
//                                         Superficie (m²)*
//                                     </label>
//                                     <input
//                                         type="number"
//                                         id="superficie"
//                                         name="superficie"
//                                         value={formData.superficie}
//                                         onChange={handleInputChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                         required
//                                         min="0"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label htmlFor="prix" className="block text-sm font-medium text-gray-700">
//                                         Prix (FCFA)*
//                                     </label>
//                                     <input
//                                         type="number"
//                                         id="prix"
//                                         name="prix"
//                                         value={formData.prix}
//                                         onChange={handleInputChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                         required
//                                         min="0"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
//                                         Statut*
//                                     </label>
//                                     <select
//                                         id="statut"
//                                         name="statut"
//                                         value={formData.statut}
//                                         onChange={handleInputChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                         required
//                                     >
//                                         <option value="DISPONIBLE">Disponible</option>
//                                         <option value="OCCUPE">Occupé</option>
//                                         <option value="RESERVER">Réservé</option>
//                                         <option value="VENDU">Vendu</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             <div>
//                                 <label htmlFor="usage" className="block text-sm font-medium text-gray-700">
//                                     Usage prévu*
//                                 </label>
//                                 <textarea
//                                     id="usage"
//                                     name="usage"
//                                     value={formData.usage}
//                                     onChange={handleInputChange}
//                                     rows={3}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                     required
//                                 />
//                             </div>

//                             <div className="flex justify-end space-x-3 pt-4 border-t">
//                                 <button
//                                     type="button"
//                                     onClick={handleCloseModal}
//                                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
//                                 >
//                                     Annuler
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
//                                 >
//                                     {loading ? (
//                                         <div className="flex items-center">
//                                             <Loader2 className="animate-spin mr-2" size={20} />
//                                             Enregistrement...
//                                         </div>
//                                     ) : (
//                                         'Ajouter'
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}


//             {planModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
//                         <div className="flex justify-between items-center mb-6 border-b pb-4">
//                             <div>
//                                 <h3 className="text-lg font-semibold text-gray-900">
//                                     Ajouter un Plan
//                                 </h3>
//                                 <p className="text-sm text-gray-500 mt-1">
//                                     Lotissement: {planFormData.lotissementNom}
//                                 </p>
//                             </div>
//                             <button onClick={handleClosePlanModal} className="text-gray-400 hover:text-gray-500">
//                                 <LuX className="h-6 w-6" />
//                             </button>
//                         </div>

//                         <form onSubmit={handlePlanSubmit} className="space-y-6">
//                             <div>
//                                 <label htmlFor="fichier" className="block text-sm font-medium text-gray-700">
//                                     Fichier du plan*
//                                 </label>
//                                 <input
//                                     type="file"
//                                     id="fichier"
//                                     name="fichier"
//                                     onChange={handlePlanInputChange}
//                                     accept=".pdf,.jpg,.jpeg,.png"
//                                     className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary hover:file:bg-primary-100"
//                                     required
//                                 />
//                                 <p className="mt-1 text-xs text-gray-500">
//                                     Formats acceptés: PDF, JPG, JPEG, PNG
//                                 </p>
//                             </div>

//                             <div>
//                                 <label htmlFor="version" className="block text-sm font-medium text-gray-700">
//                                     Version du plan*
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="version"
//                                     name="version"
//                                     value={planFormData.version}
//                                     onChange={handlePlanInputChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                                     Description du plan
//                                 </label>
//                                 <textarea
//                                     id="description"
//                                     name="description"
//                                     value={planFormData.description}
//                                     onChange={handlePlanInputChange}
//                                     rows={3}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                     placeholder="Décrivez le plan..."
//                                 />
//                             </div>

//                             <div className="flex justify-end space-x-3 pt-4 border-t">
//                                 <button
//                                     type="button"
//                                     onClick={handleClosePlanModal}
//                                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
//                                 >
//                                     Annuler
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <Loader2 className="animate-spin mr-2" size={20} />
//                                             Enregistrement...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Save className="mr-2" size={20} />
//                                             Ajouter
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default AgentLotissementListe;


import React, { useState, useEffect } from "react";
import { Table, Input, Card, Tag, Space, Button, Modal, Typography, Select, Form, InputNumber, Upload, message } from "antd";
import { SearchOutlined, PlusOutlined, FileTextOutlined, UploadOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getLotissements, updateLotissementStatut } from "@/services/lotissementService";
import { useAuthContext } from "@/context";
import { createLot } from "@/services/lotsService";
import { createPlanLotissement } from "@/services/planLotissement";
import { toast } from "sonner";
import { AgentBreadcrumb } from "@/components";
const { Title, Text } = Typography;
const { TextArea } = Input;

const AgentLotissementListe = () => {
    const { user } = useAuthContext();
    const [lotissements, setLotissements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [planModalVisible, setPlanModalVisible] = useState(false);
   
    const [selectedLotissement, setSelectedLotissement] = useState(null);
    const [form] = Form.useForm();
    const [planForm] = Form.useForm();
    const [planFile, setPlanFile] = useState(null);

    useEffect(() => {
        fetchLotissements();
    }, [user.id]);

    const fetchLotissements = async () => {
        try {
            const data = await getLotissements();
            console.log(data);
            setLotissements(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatut = async (lotissementId, nouveauStatut) => {
        try {
            await updateLotissementStatut(lotissementId, nouveauStatut);
            const updatedLotissements = lotissements.map(lotissement => {
                if (lotissement.id === lotissementId) {
                    return { ...lotissement, statut: nouveauStatut };
                }
                return lotissement;
            });
            setLotissements(updatedLotissements);
            message.success("Statut mis à jour avec succès");
        } catch (error) {
            message.error("Erreur lors de la mise à jour du statut");
        }
    };

    const handleOpenModal = (lotissement) => {
        setSelectedLotissement(lotissement);
        form.setFieldsValue({
            numeroLot: "",
            superficie: "",
            statut: "DISPONIBLE",
            prix: "",
            usage: "",
            lotissementId: lotissement.id
        });
        setModalVisible(true);
    };

    const handleOpenPlanModal = (lotissement) => {
        setSelectedLotissement(lotissement);
        planForm.setFieldsValue({
            description: "",
            version: "",
            lotissementId: lotissement.id
        });
        setPlanModalVisible(true);
    };



    const handleLotSubmit = async (values) => {
        try {
            await createLot({
                ...values,
                lotissementId: selectedLotissement.id
            });
            message.success("Lot ajouté avec succès");
            fetchLotissements();
            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error("Erreur lors de l'ajout du lot");
        }
    };

    const handlePlanSubmit = async (values) => {
        if (!planFile) {
            message.error("Veuillez sélectionner un fichier");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("description", values.description);
            formData.append("version", values.version);
            formData.append("lotissementId", selectedLotissement.id);
            formData.append("document", planFile);

            await createPlanLotissement(formData);
            message.success("Plan ajouté avec succès");
            setPlanModalVisible(false);
            planForm.resetFields();
            setPlanFile(null);
            fetchLotissements();
        } catch (error) {
            message.error("Erreur lors de l'ajout du plan");
        }
    };

    const columns = [
        {
            title: "Localité",
            key: "localite",
            render: (_, record) => (
                <Link to={`/agent/localites/${record.localite.id}/details`}>
                    {record.localite.nom}
                </Link>
            ),
        },
        {
            title: "Nom",
            dataIndex: "nom",
            key: "nom",
            sorter: (a, b) => a.nom.localeCompare(b.nom),
        },
        {
            title: "Localisation",
            dataIndex: "localisation",
            key: "localisation",
        },
        {
            title: "Statut",
            key: "statut",
            render: (_, record) => (
                <Select
                    value={record.statut}
                    onChange={(value) => handleUpdateStatut(record.id, value)}
                    style={{ width: 120 }}
                >
                    <Select.Option value="en_cours">En cours</Select.Option>
                    <Select.Option value="acheve">Achevé</Select.Option>
                    <Select.Option value="rejete">Rejeté</Select.Option>
                </Select>
            ),
        },
        {
            title: "Lots",
            key: "lots",
            render: (_, record) => (
                record.lots.length > 0 ? <>
                    <Link to={`/agent/lotissements/${record.id}/lots`}>
                        {record.lots.length} Lots
                    </Link>
                </> : <>
                <Button
                    className="text-primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenModal(record)}
                >
                    Ajouter Lot
                </Button>
                </>
            ),
        },
        {
            title: "Plans",
            key: "plans",
            render: (_, record) => (
                record.planLotissements.length > 0 ? (
                    <Link to={`/agent/lotissements/${record.id}/plans`}>
                        {record.planLotissements.length} Plans
                    </Link>
                ) : (
                    <Button
                       className="text-primary"
                        icon={<UploadOutlined />}
                        onClick={() => handleOpenPlanModal(record)}
                    >
                        Ajouter Plan
                    </Button>
                )
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Link to={`/agent/lotissements/${record.id}/details`}>
                        <Button  className="text-primary" icon={<EyeOutlined />}>
                            Détails
                        </Button>
                    </Link>
                    <Link to={`/agent/lotissements/${record.id}/modification`}>
                        <Button  className="text-primary" icon={<EditOutlined />}>
                            Modifier
                        </Button>
                    </Link>
                </Space>
            ),
        },
    ];

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-600">
                Erreur: {error}
            </div>
        );
    }

    return (
        <>
            <AgentBreadcrumb title="Liste des Lotissements" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <Card className="shadow-lg rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <Title level={4}>Liste des lotissements</Title>
                                    <Link to="/agent/lotissements/nouveau">
                                        <Button className="text-primary" icon={<PlusOutlined />}>
                                            Ajouter
                                        </Button>
                                    </Link>
                                </div>

                                <Input
                                    placeholder="Rechercher par nom ou description..."
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: 300, marginBottom: 16 }}
                                />

                                <Table
                                    columns={columns}
                                    dataSource={lotissements.filter(
                                        (item) =>
                                            item.nom.toLowerCase().includes(searchText.toLowerCase()) ||
                                            item.description.toLowerCase().includes(searchText.toLowerCase())
                                    )}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={{
                                        defaultPageSize: 5,
                                        showSizeChanger: true,
                                        showTotal: (total) => `Total ${total} lotissements`,
                                      }}
                                />

                                <Modal
                                    title={
                                        <div>
                                            <Text strong>Ajouter un Lot</Text>
                                            <Text type="secondary" style={{ display: 'block' }}>
                                                Lotissement: {selectedLotissement?.nom}
                                            </Text>
                                        </div>
                                    }
                                    open={modalVisible}
                                    onCancel={() => setModalVisible(false)}
                                    footer={null}
                                    width={800}
                                >
                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={handleLotSubmit}
                                    >
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            <Form.Item
                                                name="numeroLot"
                                                label="Numéro du Lot"
                                                rules={[{ required: true, message: 'Champ requis' }]}
                                            >
                                                <Input />
                                            </Form.Item>

                                            <Form.Item
                                                name="superficie"
                                                label="Superficie (m²)"
                                                rules={[{ required: true, message: 'Champ requis' }]}
                                            >
                                                <InputNumber style={{ width: '100%' }} min={0} />
                                            </Form.Item>

                                            <Form.Item
                                                name="prix"
                                                label="Prix (FCFA)"
                                                rules={[{ required: true, message: 'Champ requis' }]}
                                            >
                                                <InputNumber style={{ width: '100%' }} min={0} />
                                            </Form.Item>

                                            <Form.Item
                                                name="statut"
                                                label="Statut"
                                                rules={[{ required: true, message: 'Champ requis' }]}
                                            >
                                                <Select>
                                                    <Select.Option value="DISPONIBLE">Disponible</Select.Option>
                                                    <Select.Option value="OCCUPE">Occupé</Select.Option>
                                                    <Select.Option value="RESERVER">Réservé</Select.Option>
                                                    <Select.Option value="VENDU">Vendu</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </div>

                                        <Form.Item
                                            name="usage"
                                            label="Usage prévu"
                                            rules={[{ required: true, message: 'Champ requis' }]}
                                        >
                                            <TextArea rows={3} />
                                        </Form.Item>

                                        <Form.Item>
                                            <Space>
                                                <Button className="text-primary" htmlType="submit">
                                                    Enregistrer
                                                </Button>
                                                <Button onClick={() => setModalVisible(false)}>
                                                    Annuler
                                                </Button>
                                            </Space>
                                        </Form.Item>
                                    </Form>
                                </Modal>

                                <Modal
                                    title={
                                        <div>
                                            <Text strong>Ajouter un Plan</Text>
                                            <Text type="secondary" style={{ display: 'block' }}>
                                                Lotissement: {selectedLotissement?.nom}
                                            </Text>
                                        </div>
                                    }
                                    open={planModalVisible}
                                    onCancel={() => setPlanModalVisible(false)}
                                    footer={null}
                                   
                                >
                                    <Form
                                        form={planForm}
                                        layout="vertical"
                                        onFinish={handlePlanSubmit}
                                    >
                                        <Form.Item
                                            name="description"
                                            label="Description"
                                            rules={[{ required: true, message: 'Champ requis' }]}
                                        >
                                            <TextArea rows={3} />
                                        </Form.Item>

                                        <Form.Item
                                            name="version"
                                            label="Version"
                                            rules={[{ required: true, message: 'Champ requis' }]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            label="Fichier"
                                            rules={[{ required: true, message: 'Champ requis' }]}
                                        >
                                            <Upload
                                                beforeUpload={(file) => {
                                                    setPlanFile(file);
                                                    return false;
                                                }}
                                                maxCount={1}
                                            >
                                                <Button icon={<UploadOutlined />}>Sélectionner un fichier</Button>
                                            </Upload>
                                        </Form.Item>

                                        <Form.Item>
                                            <Space>
                                                <Button className="text-primary" htmlType="submit">
                                                    Enregistrer
                                                </Button>
                                                <Button onClick={() => setPlanModalVisible(false)}>
                                                    Annuler
                                                </Button>
                                            </Space>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AgentLotissementListe;
