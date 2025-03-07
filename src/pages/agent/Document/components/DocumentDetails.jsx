import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDocumentById } from "../../../../services/documentService"; // Assurez-vous que ce service existe

const DocumentDetails = () => {
    const { id } = useParams(); // Récupérer l'ID du document depuis l'URL
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const data = await getDocumentById(id); // Remplacez par votre méthode d'obtention du document
                setDocument(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id]);

    if (loading) return <div>Chargement des détails du document...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">{document.intitule}</h2>
            <p><strong>Type de Document:</strong> {document.typeDocument}</p>
            <p><strong>Date d'Obtention:</strong> {new Date(document.dateObtention).toLocaleDateString()}</p>
            <p><strong>Statut:</strong> {document.statut}</p>

            {/* Affichage des informations du demandeur */}
            {document.demandeur && (
                <>
                    <h3 className="mt-4 font-semibold">Demandeur:</h3>
                    <p><strong>Nom:</strong> {document.demandeur.name}</p>
                    <p><strong>Pays de Résidence:</strong> {document.demandeur.paysResidence}</p>
                    <p><strong>Téléphone:</strong> {document.demandeur.phone}</p>
                </>
            )}

            {/* Affichage des informations de l'institut associé */}
            {document.institut && (
                <>
                    <h3 className="mt-4 font-semibold">Institut Associé:</h3>
                    <p><strong>Nom:</strong> {document.institut.name}</p>
                    <p><strong>Email:</strong> {document.institut.email}</p>
                    <p><strong>Téléphone:</strong> {document.institut.phone}</p>
                </>
            )}
        </div>
    );
};

export default DocumentDetails;