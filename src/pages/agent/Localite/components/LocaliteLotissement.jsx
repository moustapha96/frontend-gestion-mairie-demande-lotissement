

"use client";
import { AgentBreadcrumb } from "@/components";
import { LuSearch, LuChevronLeft, LuChevronRight, LuFileText, LuPlus, LuPlusSquare } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/utils";
import { useAuthContext } from "@/context";
import { Badge, BadgeCent, BadgePlusIcon, Edit2, File } from "lucide-react";
import { BadgeAlert, Eye } from "lucide";
import { FaEye } from "react-icons/fa";
import { toast } from "sonner";
import { getLocaliteDetails, getLocaliteLotissement } from "@/services/localiteService";
import { updateLotissementStatut } from "@/services/lotissementService";

const AdminLocaliteLotissement = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const [lotissements, setLotissements] = useState([]);
    const [localite, setLocalite] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const fetchLotissements = async () => {
            try {
                const data = await getLocaliteLotissement(id);
                console.log(data);
                setLotissements(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const fetchLocalite = async () => {
            try {
                const data = await getLocaliteDetails(id);
                console.log(data)
                setLocalite(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchLocalite();
        fetchLotissements();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen">Chargement des lotissements...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>;

    const filteredLotissements = lotissements.filter(
        (lotissement) =>
            lotissement.nom.toLowerCase().includes(filter.toLowerCase()) ||
            lotissement.description.toLowerCase().includes(filter.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLotissements.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleFileView = (filePath) => {
        window.open(filePath, "_blank");
    };


    const handleUpdateStatut = async (lotissementId, nouveauStatut) => {
        try {
            await updateLotissementStatut(lotissementId, nouveauStatut);
            // Mise à jour locale des données
            const updatedLotissements = lotissements.map(lotissement => {
                if (lotissement.id === lotissementId) {
                    return { ...lotissement, statut: nouveauStatut };
                }
                return lotissement;
            });
            setLotissements(updatedLotissements);
            toast.success("Statut mis à jour avec succès");
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du statut");
        }
    };


    return (
        <>
            <AgentBreadcrumb title="Liste de Lotissements" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">

                                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                    <h4 className="text-xl font-semibold text-gray-800 uppercase">Lotissements Localité</h4>
                                    {localite && <>
                                        <h4 className="text-xl font-semibold text-gray-800 uppercase">
                                            <Link to={`/admin/quartiers/${id}/details`} >Localité :
                                                <span className="ml-2 text-primary">
                                                    {localite.nom}
                                                </span>
                                            </Link>
                                        </h4>

                                    </>}
                                </div>

                                <div className="flex items-center justify-end border-b gap-4 border-gray-200 px-6 py-4">
                                    <Link
                                        to="/admin/lotissements/nouveau"
                                        className="text-primary flex items-center gap-2"
                                    >
                                        <LuPlusSquare className="mr-2" /> Ajouter
                                    </Link>
                                </div>



                                <div className="p-6">
                                    <div className="flex mb-4">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                placeholder="Rechercher par nom ou description..."
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>


                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nom
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Localisation
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Description
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Statut
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date de Création
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Lots
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Plans
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {currentItems.map((lotissement) => (
                                                    <tr key={lotissement.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {lotissement.nom}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lotissement.localisation}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lotissement.description}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">

                                                            <select
                                                                value={lotissement.statut}
                                                                onChange={(e) => handleUpdateStatut(lotissement.id, e.target.value)}
                                                                className={cn(
                                                                    "text-sm border rounded-md py-1 px-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none",
                                                                    {
                                                                        'bg-green-100 text-green-800 border border-green-500': lotissement.statut === 'acheve',
                                                                        'bg-red-100 text-red-800 border border-red-500': lotissement.statut === 'rejete',
                                                                        'bg-yellow-100 text-yellow-500 border border-yellow-500': lotissement.statut === 'en_cours',
                                                                        'bg-gray-100 text-gray-500 border border-gray-500': !lotissement.statut
                                                                    }
                                                                )}
                                                            >

                                                                <option value="en_cours">En cours</option>
                                                                <option value="acheve">Achevé</option>
                                                                <option value="rejete">Rejeté</option>
                                                            </select>
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(lotissement.dateCreation).toLocaleDateString()}
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center space-x-2">
                                                                {lotissement.lots.length > 0 && <>
                                                                    <Link
                                                                        to={`/admin/lotissements/${lotissement.id}/lots`}
                                                                        className="text-primary hover:text-primary-700 transition-colors duration-200 flex justify-center items-center px-4 py-2 "
                                                                    >
                                                                        {lotissement.lots.length}  Lots
                                                                    </Link>
                                                                </>}

                                                            </div>
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center space-x-2">
                                                                {lotissement.planLotissements.length > 0 && <>

                                                                    <Link
                                                                        to={`/admin/lotissements/${lotissement.id}/plans`}
                                                                        className="text-primary hover:text-primary-700 transition-colors duration-200 flex justify-center items-center px-4 py-2 "
                                                                    >
                                                                        {lotissement.planLotissements.length} <File className="mr-2" />

                                                                    </Link>
                                                                </>}
                                                            </div>
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center space-x-4">
                                                                <Link
                                                                    to={`/admin/lotissements/${lotissement.id}/details`}
                                                                    className="text-primary hover:text-primary-700 transition-colors duration-200"
                                                                >
                                                                    <FaEye size={18} />
                                                                </Link>

                                                                <Link
                                                                    to={`/admin/lotissements/${lotissement.id}/modification`}
                                                                    className="text-primary hover:text-primary-700 transition-colors duration-200"
                                                                >
                                                                    <Edit2 size={18} />
                                                                </Link>


                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-sm text-gray-700">
                                            Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredLotissements.length)} sur{" "}
                                            {filteredLotissements.length} entrées
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={cn(
                                                    "px-3 py-1 rounded-md",
                                                    currentPage === 1
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                                )}
                                            >
                                                <LuChevronLeft className="h-5 w-5" />
                                            </button>
                                            {Array.from({ length: Math.ceil(filteredLotissements.length / itemsPerPage) }).map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => paginate(index + 1)}
                                                    className={cn(
                                                        "px-3 py-1 rounded-md",
                                                        currentPage === index + 1 ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                                                    )}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === Math.ceil(filteredLotissements.length / itemsPerPage)}
                                                className={cn(
                                                    "px-3 py-1 rounded-md",
                                                    currentPage === Math.ceil(filteredLotissements.length / itemsPerPage)
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                                )}
                                            >
                                                <LuChevronRight className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
};

export default AdminLocaliteLotissement;


