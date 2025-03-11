"use client";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    Calendar,
    CheckCircle,
    MapPin,
    FileText,
    File,
    Loader,
    Map
} from "lucide-react";
import { getLocaliteDetails } from "@/services/localiteService";
import { AdminBreadcrumb } from "@/components";
import { LuEye } from "react-icons/lu";
import { cn } from "@/utils";
import MapCar from "../../../admin/Map/MapCar";
import { formatPrice } from "@/utils/formatters";

export default function AdminLocaliteDetails() {
    const { id } = useParams();
    const [localite, setLocalite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocalite = async () => {
            try {
                const data = await getLocaliteDetails(id);
                setLocalite(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLocalite();
    }, [id]);

    // if (loading) return <p>Chargement...</p>;
    // if (error) return <p className="text-red-500">Erreur: {error}</p>;

    if (loading) return <LoadingSkeleton />
    if (error) return <ErrorDisplay error={error} />


    return (
        <>
            <AdminBreadcrumb title="Détails de la Localité" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">


                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                <h1 className="text-2xl font-bold mb-4">Détail de la Localité</h1>

                            </div>
                            <LocaliteInfoCard localite={localite} />
                            {localite.lotissements?.length > 0 && <LotissementTable lotissements={localite.lotissements} />}

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function LocaliteInfoCard({ localite }) {
    const [showMap, setShowMap] = useState(false);

    return (
        <div className="bg-gray-50 shadow rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium mb-4">Informations de la Localité</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<FileText className="w-5 h-5" />} label="Nom" value={localite.nom} />
                <InfoItem icon={<FileText className="w-5 h-5" />} label="Description" value={localite.description} />
                <InfoItem icon={<FileText className="w-5 h-5" />} label="Prix" value={formatPrice(localite.prix)} />
                {localite.longitude && localite.latitude && (
                    <InfoItem2
                        icon={<MapPin className="w-5 h-5" />}
                        label="Coordonnées"
                        // value={`${localite.longitude, localite.latitude}`}
                        longitude={localite.longitude}
                        latitude={localite.latitude}
                        isCoordinates={true}
                        onShowMap={() => setShowMap(!showMap)}
                    />
                )}
            </div>

            {showMap && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium">Carte Interactive</h4>
                        <button
                            onClick={() => setShowMap(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Fermer la carte
                        </button>
                    </div>
                    <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
                        <MapCar selectedItem={localite} type="localite" />
                    </div>
                </div>
            )}
        </div>
    );
}

function LotissementTable({ lotissements }) {
    return (
        <TableComponent title="Lotissements" columns={["Nom", "Localisation", "Statut", "Date de Création", "Option"]}>
            {lotissements.map((lotissement) => (
                <tr key={lotissement.id} className="border-b">
                    <td className="p-4">{lotissement.nom}</td>
                    <td className="p-4">{lotissement.localisation}</td>
                    <td className="p-4">
                        <span className={cn(
                            "text-sm border rounded-md py-1 px-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none",
                            {
                                'bg-green-100 text-green-800 border border-green-500': lotissement.statut === 'acheve',
                                'bg-red-100 text-red-800 border border-red-500': lotissement.statut === 'rejete',
                                'bg-yellow-100 text-yellow-500 border border-yellow-500': lotissement.statut === 'en_cours',
                                'bg-gray-100 text-gray-500 border border-gray-500': !lotissement.statut
                            }
                        )}>
                            {lotissement.statut}
                        </span>
                    </td>
                    <td className="p-4">{new Date(lotissement.dateCreation).toLocaleDateString()}</td>
                    <td className="p-4">
                        <Link
                            to={`/admin/lotissements/${lotissement.id}/details`}
                            className="text-primary hover:text-primary-700 transition-colors duration-200 flex items-center"
                        >
                            <LuEye className="mr-1" /> Détails
                        </Link>

                    </td>
                </tr>
            ))
            }
        </TableComponent >
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

function InfoItem({ icon, label, value, isCoordinates, onShowMap }) {
    return (
        <div className="flex items-center space-x-3 bg-white shadow-sm p-3 rounded-lg">
            <div className="text-gray-500">{icon}</div>
            <div className="flex-grow">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-sm text-gray-900">{value || "N/A"}</p>
            </div>
            {isCoordinates && (
                <button
                    onClick={onShowMap}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                    <Map className="w-4 h-4" />
                    Voir sur la carte
                </button>
            )}
        </div>
    );
}
function InfoItem2({ icon, label, longitude, latitude, isCoordinates, onShowMap }) {
    return (
        <div className="flex items-center space-x-3 bg-white shadow-sm p-3 rounded-lg">
            <div className="text-gray-500">{icon}</div>
            <div className="flex-grow">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-sm text-gray-900">{longitude + ' , ' + latitude || "N/A"}</p>
            </div>
            {isCoordinates && (
                <button
                    onClick={onShowMap}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                    <Map className="w-4 h-4" />
                    Voir sur la carte
                </button>
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
