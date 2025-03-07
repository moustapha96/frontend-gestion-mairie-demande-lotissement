
"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Calendar,
    Award,
    CheckCircle,
    Building,
    MapPin,
    FileText,
    Eye,
    Loader,
    File,
    MapPinCheck
} from "lucide-react";
import { getLotissementDetails, } from "@/services/lotissementService";
import { AdminBreadcrumb } from "@/components";
import { getFileDocumentPlan } from "@/services/planLotissement";

export default function AdminLotissementDetails() {
    const { id } = useParams();
    const [lotissement, setLotissement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [Fileloading, setFileLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fichier, setFichier] = useState(null);
    const [showFile, setShowFile] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    useEffect(() => {
        const fetchLotissement = async () => {
            try {
                const data = await getLotissementDetails(id);
                setLotissement(data);
                if (data.planLotissements?.length > 0) {
                    const response = await getFileDocumentPlan(data.planLotissements[0].id);
                    setFichier(response);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLotissement();
    }, [id]);

    const closeViewer = () => {
        setIsViewerOpen(false)
        setFichier(null)
    }

    const handleViewDocument = async (plan) => {
        setFileLoading(true)
        setIsViewerOpen(true)
        try {
            const response = await getFileDocumentPlan(plan.id)
            // Supposons que la réponse contient directement la chaîne base64
            setFichier(response)
        } catch (error) {
            console.error("Erreur lors de l'ouverture du document:", error)
        } finally {
            setFileLoading(false)
        }
    }




    if (loading) return <LoadingSkeleton />
    if (error) return <ErrorDisplay error={error} />
    return (
        <>
            <AdminBreadcrumb title="Détails du Lotissement" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">

                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

                                <h1 className="text-2xl font-bold mb-4">Détail du Lotissement</h1>
                            </div>
                            <LotissementInfoCard lotissement={lotissement} />
                            {lotissement.lots?.length > 0 && <LotInfoTable lots={lotissement.lots} />}
                            {lotissement.planLotissements?.length > 0 && <PlanInfoTable plans={lotissement.planLotissements} setShowFile={setShowFile} isViewerOpen={isViewerOpen}
                                isLoading={Fileloading} setLoading={setFileLoading} fichier={fichier} handleViewDocument={handleViewDocument} closeViewer={closeViewer} />}
                            {showFile && fichier && (
                                <div className="mt-6">
                                    <h2 className="text-xl font-semibold">Prévisualisation</h2>
                                    <iframe src={`data:application/pdf;base64,${fichier}`} title="Document" width="100%" height="600px" className="mt-4 border rounded-lg"></iframe>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function LotissementInfoCard({ lotissement }) {
    return (
        <div className="bg-gray-50 shadow rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium mb-4">Informations du Lotissement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<Calendar className="w-5 h-5" />} label="Date de Création" value={new Date(lotissement.dateCreation).toLocaleDateString()} />
                <InfoItem icon={<FileText className="w-5 h-5" />} label="Nom" value={lotissement.nom} />
                <InfoItem icon={<MapPin className="w-5 h-5" />} label="Localisation" value={lotissement.localisation} />
                <InfoItem icon={<CheckCircle className="w-5 h-5" />} label="Statut" value={lotissement.statut} />

                <InfoItem
                    icon={<MapPinCheck className="w-5 h-5" />}
                    label={"Coordonnées"}
                    value={lotissement.longitude + "," + lotissement.latitude}
                />
            </div>
        </div>
    );
}

function LotInfoTable({ lots }) {
    return (
        <TableComponent title="Informations des Lots" columns={["Numéro de Lot", "Superficie", "Coordonnées", "Statut", "Prix"]}>
            {lots.map((lot) => (
                <tr key={lot.id} className="border-b">
                    <td className="p-4">{lot.numeroLot}</td>
                    <td className="p-4">{lot.superficie} m²</td>
                    <td className="p-4">{lot.longitude + "," + lot.latitude} </td>
                    <td className="p-4">{lot.statut}</td>
                    <td className="p-4">{lot.prix} FCFA</td>
                </tr>
            ))}
        </TableComponent>
    );
}

function PlanInfoTable({ plans, setShowFile, isViewerOpen, fichier, handleViewDocument, closeViewer, isLoading, setLoading }) {
    return (
        <TableComponent title="Plans de Lotissement" columns={["Description", "Date de Création", "Version", "Action"]}>
            {plans.map((plan) => (
                <tr key={plan.id} className="border-b">
                    <td className="p-4">{plan.description}</td>
                    <td className="p-4">{new Date(plan.dateCreation).toLocaleDateString()}</td>
                    <td className="p-4">{plan.version}</td>
                    <td className="p-4">


                        <button
                            onClick={() => handleViewDocument(plan)}
                            className="text-primary hover:text-primary-light transition-colors duration-200"
                            aria-label="Visualiser le document"
                        >
                            <File className="w-8 h-8" />
                        </button>
                    </td>
                </tr>
            ))}
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
                            {isLoading ? (
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
        </TableComponent>
    );
}

function TableComponent({ title, columns, children }) {
    return (
        <div className="bg-gray-50 shadow rounded-lg p-4 mb-6 overflow-x-auto">
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className="p-4 border-b text-gray-600 uppercase text-sm">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-center space-x-3 bg-white shadow-sm p-3 rounded-lg">
            <div className="text-gray-500">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-sm text-gray-900">{value || "N/A"}</p>
            </div>
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
                            <div key={i} className="bg-white shadow rounded-lg overflow-hidden">
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
            <div className="bg-white shadow rounded-lg overflow-hidden w-full max-w-md">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-red-600 mb-4">Erreur</h3>
                    <p className="text-center">{error}</p>
                </div>
            </div>
        </div>
    )
}