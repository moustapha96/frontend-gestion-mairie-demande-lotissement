"use client";
import { AgentBreadcrumb } from "@/components";
import { LuSearch, LuChevronLeft, LuChevronRight, LuFileText, LuPlusCircle } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/utils";
import { getLotissementDetails, getLotissementPlan } from "@/services/lotissementService";
import { useAuthContext } from "@/context";
import { getFileDocumentPlan } from "@/services/planLotissement";
import { Loader, Loader2 } from "lucide-react";

const AgentLotissementPlan = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [fileLoading, setFileLoading] = useState(false);
    const [fichier, setFichier] = useState(null);
    const [lotissement, setLotissement] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await getLotissementPlan(id);
                setPlans(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const fetchLotissement = async () => {
            try {
                const data = await getLotissementDetails(id)
                setLotissement(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchLotissement()
        fetchPlans();
    }, [id, user.id]);

    const handleViewDocument = async (plan) => {
        setFileLoading(true);
        setIsViewerOpen(true);
        try {
            const response = await getFileDocumentPlan(plan.id);
            setFichier(response); // Supposons que la réponse contient directement la chaîne base64
        } catch (error) {
            console.error("Erreur lors du chargement du fichier", error);
        } finally {
            setFileLoading(false);
        }
    };
    const closeViewer = () => {
        setIsViewerOpen(false)
        setFichier(null)
    }
    // if (loading) return <div className="flex justify-center items-center h-screen">Chargement des plans...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>;

    const filteredPlans = plans.filter((plan) =>
        plan.description.toLowerCase().includes(filter.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPlans.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <AgentBreadcrumb title="Liste des Plans de Lotissement" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                <h4 className="text-xl font-semibold text-gray-800 uppercase">Plans de lotissement</h4>

                                {lotissement && <>
                                    <h4 className="text-xl font-semibold text-gray-800 uppercase">
                                        <Link to={`/agent/lotissements/${id}/details`} >Lotissement :
                                            <span className="ml-2 text-primary">
                                                {lotissement.nom}
                                            </span>
                                        </Link>
                                    </h4>

                                </>}


                            </div>

                            <div className="p-6">
                                <div className="flex mb-4">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            placeholder="Rechercher par description..."
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date de Création</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentItems.map((plan) => (
                                                <tr key={plan.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="px-6 py-4 text-sm text-gray-900">{plan.description}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{plan.version}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date(plan.dateCreation).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium">
                                                        <button
                                                            onClick={() => handleViewDocument(plan)}
                                                            className="text-primary hover:text-primary-700 flex items-center space-x-1"
                                                        >
                                                            <LuFileText className="w-5 h-5" />
                                                            <span>Voir</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                        {loading && (
                                            <tbody className="w-full">
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12">
                                                        <div className="flex items-center justify-center">
                                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        )}
                                    </table>
                                    {isViewerOpen && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                            <div className="bg-white p-4 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h2 className="text-2xl font-bold text-gray-800">{"Document"}</h2>
                                                    <button onClick={closeViewer} className="text-gray-500 hover:text-gray-700">
                                                        Fermer
                                                    </button>
                                                </div>
                                                <div className="bg-gray-200 rounded-lg p-4">
                                                    {fileLoading ? (
                                                        <div className="flex justify-center items-center h-[600px]">
                                                            <Loader className="w-12 h-12 animate-spin text-blue-600" />
                                                            <span className="ml-2 text-lg font-semibold text-gray-700">Chargement du document...</span>
                                                        </div>
                                                    ) : fichier ? (
                                                        <iframe
                                                            src={`data:application/pdf;base64,${fichier}`}
                                                            width="100%"
                                                            height="600px"
                                                            title="Document PDF"
                                                            className="border rounded"
                                                            onLoad={(e) => {
                                                                const iframe = e.target
                                                                if (iframe instanceof HTMLIFrameElement) {
                                                                    if (iframe.contentWindow) {
                                                                        iframe.contentWindow.document.body.addEventListener("contextmenu", (event) =>
                                                                            event.preventDefault(),
                                                                        )
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex justify-center items-center h-[600px]">
                                                            <span className="text-lg font-semibold text-gray-700">Erreur de chargement du document.</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-700">
                                        Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredPlans.length)} sur {filteredPlans.length} entrées
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                                        >
                                            <LuChevronLeft className="h-5 w-5" />
                                        </button>
                                        {Array.from({ length: Math.ceil(filteredPlans.length / itemsPerPage) }).map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => paginate(index + 1)}
                                                className={cn("px-3 py-1 rounded-md", currentPage === index + 1 ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50")}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === Math.ceil(filteredPlans.length / itemsPerPage)}
                                            className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                                        >
                                            <LuChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AgentLotissementPlan;
