
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download, Search, ChevronRight, ChevronLeft, X, FileText, User, Building, Calendar, MapPin, Maximize2, Clock, Target, FileSpreadsheet, FileDown, Loader2 } from "lucide-react";
import { getDocumentDemandeur, getDocuments } from "@/services/documentService";
import { useAuthContext } from "@/context";
import { LuChevronLeft, LuPlusSquare } from "react-icons/lu";
import { exportToCSV, exportToPDF } from "@/utils/export_function";
import { cn } from "@/utils";

const DocumentListe = () => {
    const { user } = useAuthContext();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("");
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [documentsPerPage] = useState(5);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await getDocuments();
                console.log(res);
                setDocuments(res);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [user.id]);

    // if (loading) return <div className="flex justify-center items-center h-screen">Chargement des documents...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-600">Erreur: {error}</div>;

    const filteredDocuments = documents && documents.filter(document =>
        document.type.toLowerCase().includes(filter.toLowerCase()) ||
        document.contenu.localite?.toLowerCase().includes(filter.toLowerCase())
    );

    const indexOfLastDocument = currentPage * documentsPerPage;
    const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
    const currentDocuments = filteredDocuments && filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleOpenPopup = (document) => {
        setSelectedDocument(document);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedDocument(null);
    };

    const columns = [
        { id: 'numero', label: 'Numéro' },
        { id: 'type', label: 'Type' },
        // { id: 'dateCreation', label: 'Date de création' },
        { id: 'localite', label: 'Localité' },
        { id: 'superficie', label: 'Superficie' },
        { id: 'actions', label: 'Actions' },
    ];

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">


                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h4 className="text-xl font-semibold text-gray-800 uppercase">Liste des Documents</h4>
                </div>


                <div className="flex items-center justify-end border-b gap-4 border-gray-200 px-6 py-4">


                    <button
                        onClick={() => exportToCSV(documents)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        Exporter CSV
                    </button>


                    <button
                        onClick={() => exportToPDF(documents)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
                    >
                        <FileDown className="w-4 h-4" />
                        Exporter PDF
                    </button>



                </div>

                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher par intitulé..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentDocuments && currentDocuments.map((document) => (
                                <tr key={document.id} className="hover:bg-gray-50 transition duration-300">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {document.type === 'PERMIS_OCCUPATION'
                                            ? document.contenu.numeroPermis
                                            : document.contenu.numeroBail}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${document.type === 'PERMIS_OCCUPATION'
                                            ? "bg-green-100 text-green-800"
                                            : "bg-blue-100 text-blue-800"}`}>
                                            {document.type === 'PERMIS_OCCUPATION' ? 'Permis d\'occuper' : 'Bail communal'}
                                        </span>
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(document.dateCreation).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {document.demande.localite.nom}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {document.contenu.superficie} m²
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => handleOpenPopup(document)}
                                                className="text-primary hover:text-primary-dark transition-colors duration-200 flex items-center"
                                            >
                                                <FileText className="w-4 h-4 mr-1" />
                                                Détails
                                            </button>

                                        </div>
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
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-700">
                            Affichage de {indexOfFirstDocument + 1} à {Math.min(indexOfLastDocument, filteredDocuments.length)} sur {filteredDocuments.length} documents
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">


                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={cn(
                                    "px-3 py-1 rounded-md",
                                    currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </button>
                            {Array.from({ length: Math.ceil(filteredDocuments.length / documentsPerPage) }).map((_, index) => (
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
                                disabled={currentPage === Math.ceil(filteredDocuments.length / documentsPerPage)}
                                className={cn(
                                    "px-3 py-1 rounded-md",
                                    currentPage === Math.ceil(filteredDocuments.length / documentsPerPage) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            {showPopup && selectedDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full m-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Détails du {selectedDocument.type === 'PERMIS_OCCUPATION' ? 'Permis d\'occuper' : 'Bail communal'}
                            </h2>
                            <button onClick={handleClosePopup} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-700">Informations générales</h3>
                                <InfoItem
                                    icon={<FileText />}
                                    label="Numéro"
                                    value={selectedDocument.type === 'PERMIS_OCCUPATION'
                                        ? selectedDocument.contenu.numeroPermis
                                        : selectedDocument.contenu.numeroBail}
                                />
                                <InfoItem
                                    icon={<Calendar />}
                                    label="Date de création"
                                    value={new Date(selectedDocument.dateCreation).toLocaleString('fr-FR')}
                                />
                                <InfoItem
                                    icon={<MapPin />}
                                    label="Quartier"
                                    value={selectedDocument.demande.localite.nom}
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-700">Détails spécifiques</h3>
                                <InfoItem
                                    icon={<Maximize2 />}
                                    label="Superficie"
                                    value={`${selectedDocument.contenu.superficie} m²`}
                                />
                                <InfoItem
                                    icon={<Clock />}
                                    label="Durée"
                                    value={selectedDocument.contenu.dureeValidite || selectedDocument.contenu.duree}
                                />
                                <InfoItem
                                    icon={<Target />}
                                    label="Usage prévu"
                                    value={selectedDocument.contenu.usagePrevu}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 text-gray-400">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-sm text-gray-900">{value || "N/A"}</p>
        </div>
    </div>
);

export default DocumentListe;
