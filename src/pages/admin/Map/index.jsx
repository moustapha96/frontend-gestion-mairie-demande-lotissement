"use client";
import { AdminBreadcrumb } from "@/components";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context";
import { MapContainer, TileLayer, Marker, Popup, LayerGroup } from "react-leaflet";
import L from "leaflet";
import { getLotissements } from "@/services/lotissementService";
import { getLots } from "@/services/lotsService";
import { Loader2 } from "lucide-react";

import markerIconPng from "@/assets/images/logo-dark.png";
import markerShadowPng from "@/assets/images/avatars/img-2.jpg";

// Icônes personnalisés
const lotissementIcon = L.icon({
    iconUrl: markerIconPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const lotIcon = L.icon({
    iconUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const AdminMap = () => {
    const { user } = useAuthContext();
    const [lotissements, setLotissements] = useState([]);
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [lotissementsLoaded, setLotissementsLoaded] = useState(false);
    const [lotsLoaded, setLotsLoaded] = useState(false);
    const [mapCenter] = useState([14.6937, -17.4441]);
    const [mapZoom] = useState(13);

    // Afficher la carte après un petit délai
    useEffect(() => {
        setTimeout(() => {
            setMapLoaded(true);
        }, 1000);
    }, []);

    useEffect(() => {
        if (mapLoaded) {
            fetchLotissements();
        }
    }, [mapLoaded]);

    useEffect(() => {
        if (lotissementsLoaded) {
            fetchLots();
        }
    }, [lotissementsLoaded]);

    const fetchLotissements = async () => {
        try {
            const lotissementsData = await getLotissements();
            setLotissements(lotissementsData);
            setLotissementsLoaded(true);
        } catch (err) {
            setError(err.message);
            console.error("Erreur lors du chargement des lotissements:", err);
        }
    };

    const fetchLots = async () => {
        try {
            const lotsData = await getLots();
            setLots(lotsData);
            setLotsLoaded(true);
        } catch (err) {
            setError(err.message);
            console.error("Erreur lors du chargement des lots:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <AdminBreadcrumb title="Carte des Lotissements" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <div className="bg-white dark:bg-default-50 shadow-lg rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white uppercase">
                                        Carte Interactive
                                    </h4>
                                </div>

                                <div className="p-6">
                                    <div className="h-[600px] w-full">
                                        {mapLoaded && (
                                            <MapContainer
                                                center={mapCenter}
                                                zoom={mapZoom}
                                                style={{ height: "100%", width: "100%" }}
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                />

                                                {/* Couche des lotissements */}
                                                {lotissementsLoaded && (
                                                    <LayerGroup>
                                                        {lotissements.map((lotissement) => (
                                                            <Marker
                                                                key={lotissement.id}
                                                                position={[
                                                                    lotissement.latitude,
                                                                    lotissement.longitude,
                                                                ]}
                                                                icon={lotissementIcon}
                                                            >
                                                                <Popup>
                                                                    <div className="p-2">
                                                                        <h3 className="font-bold">
                                                                            {lotissement.nom}
                                                                        </h3>
                                                                        <p>
                                                                            Surface: {lotissement.surface} m²
                                                                        </p>
                                                                        <p>
                                                                            Localité: {lotissement.localite?.nom}
                                                                        </p>
                                                                    </div>
                                                                </Popup>
                                                            </Marker>
                                                        ))}
                                                    </LayerGroup>
                                                )}

                                                {/* Couche des lots */}
                                                {lotsLoaded && (
                                                    <LayerGroup>
                                                        {lots.map((lot) => (
                                                            <Marker
                                                                key={lot.id}
                                                                position={[lot.latitude, lot.longitude]}
                                                                icon={lotIcon}
                                                            >
                                                                <Popup>
                                                                    <div className="p-2">
                                                                        <h3 className="font-bold">
                                                                            Lot {lot.numero}
                                                                        </h3>
                                                                        <p>Surface: {lot.surface} m²</p>
                                                                        <p>
                                                                            Lotissement: {lot.lotissement?.nom}
                                                                        </p>
                                                                    </div>
                                                                </Popup>
                                                            </Marker>
                                                        ))}
                                                    </LayerGroup>
                                                )}
                                            </MapContainer>
                                        )}
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

export default AdminMap;
