import { useState, useEffect } from "react";

import { AdminBreadcrumb } from "@/components";
import { getInstitut } from "../../../services/institutService";
import { Link, useParams } from "react-router-dom";
import { getFileDocument } from "../../../services/documentService";
const DocumentInstitut = () => {

    const { id } = useParams();
    const [institut, setInstitut] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [documents, setDocuments] = useState(null);
    const [filter, setFilter] = useState(""); // État pour le filtre

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const data = await getInstitut(id);
                setInstitut(data);
                setDocuments(data.documents);
                console.log(data)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id]);

    if (loading) return <div>Chargement des documents...</div>;
    if (error) return <div>Erreur: {error}</div>;

    // Filtrer les documents en fonction du texte saisi
    const filteredDocuments = documents.filter(document =>
        document.intitule.toLowerCase().includes(filter.toLowerCase())
    );

    const handleOpenDocument = async (document) => {
        console.log(document);
        try {
            const file = await getFileDocument(document.id);
            console.log(file);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <AdminBreadcrumb title="Document Institut" />



            <section >
                <div className="container">
                    <div className="my-6 space-y-6">
                        {/* Champ de filtre */}
                        <div className="px-4 py-2">
                            <input
                                type="text"
                                placeholder="Rechercher par intitulé..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full rounded-md border border-default-300 px-3 py-2"
                            />
                        </div>

                        <div className="overflow-auto">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-default-200">
                                        <thead>
                                            <tr className="bg-default-100">
                                                <th
                                                    scope="col"
                                                    className="px-4 py-4 text-start text-sm font-semibold text-default-900"
                                                >
                                                    #ADN
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-4 text-start text-sm font-semibold text-default-900"
                                                >
                                                    Intitulé
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-4 text-start text-sm font-semibold text-default-900"
                                                >
                                                    Type de Document
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-4 text-start text-sm font-semibold text-default-900"
                                                >
                                                    Date d'Obtention
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-4 text-start text-sm font-semibold text-default-900"
                                                >
                                                    Demandeur
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-4 text-start text-sm font-semibold text-default-900"
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-default-200">
                                            {filteredDocuments.map((document) => (
                                                <tr key={document.id} className="hover:bg-default-100">
                                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-default-600">
                                                        {document.codeAdn}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-default-600">
                                                        {document.intitule}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-default-600">
                                                        {document.typeDocument}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-default-600">
                                                        {new Date(document.dateObtention).toLocaleDateString()} {/* Formatage de la date */}
                                                    </td>
                                                    <td className="whitespace-nowrap px-[10px] py-[5px]">
                                                        {/* Afficher le nom du demandeur */}
                                                        {document.demandeur ? document.demandeur.name : "Inconnu"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-[10px] py-[5px]">
                                                        {/* Bouton pour voir les détails */}
                                                        <button
                                                            onClick={() => handleOpenDocument(document)}
                                                            className="inline-flex items-center gap-x-[5px] rounded-full bg-blue-500 px-[10px] py-[5px] text-xs font-medium text-white transition-all duration=300 hover:bg-blue=700"
                                                        >
                                                            Document
                                                        </button>


                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section >

        </>
    );

};

export default DocumentInstitut;