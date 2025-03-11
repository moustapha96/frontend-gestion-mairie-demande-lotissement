"use client"
import { AdminBreadcrumb } from "@/components"
import React, { useState, useEffect } from "react"
import { useAuthContext } from "@/context"
import { Loader2 } from "lucide-react"
import { getLotissements } from "@/services/lotissementService"

import markerIconPng from "@/assets/pin.png"
import markerShadowPng from "@/assets/location.png"

import "@/styles/map.css"
import { getLocalites } from "@/services/localiteService"
import { getParcelles } from "@/services/parcelleService"

import { MapContainer, TileLayer, Marker, Popup, CircleMarker, ZoomControl, Polygon } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { formatPrice } from "@/utils/formatters"

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIconPng,
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
})

// Ajoutez cette fonction avant le composant AdminMap
const createBoundingBox = (parcelles) => {
    if (!parcelles || parcelles.length === 0) return [];

    // Trouver les coordonnées min et max
    const lats = parcelles.map(p => parseFloat(p.latitude));
    const lngs = parcelles.map(p => parseFloat(p.longitude));

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Ajouter une marge de 0.0001 degrés (environ 10 mètres)
    const margin = 0.0001;

    // Créer le polygone rectangulaire
    return [
        [minLat - margin, minLng - margin],
        [maxLat + margin, minLng - margin],
        [maxLat + margin, maxLng + margin],
        [minLat - margin, maxLng + margin],
        [minLat - margin, minLng - margin], // Fermer le polygone
    ];
};

const AdminMap = () => {
    const { user } = useAuthContext()
    const [lotissements, setLotissements] = useState([])
    const [loading, setLoading] = useState(true)
    const [mapLoaded, setMapLoaded] = useState(false)
    const [center] = useState([14.6937, -17.4441])
    const [zoom] = useState(9)
    const [localites, setLocalites] = useState([])
    const [parcelles, setParcelles] = useState([])
    const [filters, setFilters] = useState({
        showLotissements: true,
        showLocalites: false,
        showParcelles: false,
        showZones: false
    });

    // Définition des icônes personnalisées
    const localiteIcon = new L.Icon({
        iconUrl: markerIconPng,
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -35]
    })

    const lotissementIcon = new L.Icon({
        iconUrl: markerShadowPng,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    })

    useEffect(() => {
        setTimeout(() => {
            setMapLoaded(true)
        }, 1000)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lotissementsData, localitesData, parcellesData] = await Promise.all([
                    getLotissements(),
                    getLocalites(),
                    getParcelles()
                ]);

                // Séparer les parcelles des lotissements
                const lotissementsWithoutParcelles = lotissementsData.map(lot => ({
                    ...lot,
                    parcelles: []
                }));

                setLotissements(lotissementsWithoutParcelles);
                setLocalites(localitesData);
                setParcelles(parcellesData);
            } catch (err) {
                console.error("Erreur:", err);
            } finally {
                setLoading(false);
            }
        };

        if (mapLoaded) {
            fetchData();
        }
    }, [mapLoaded]);

    const validLotissements = lotissements.filter((lot) => {
        const lat = typeof lot.latitude === "string" ? Number.parseFloat(lot.latitude) : lot.latitude
        const lon = typeof lot.longitude === "string" ? Number.parseFloat(lot.longitude) : lot.longitude
        return !isNaN(lat) && !isNaN(lon) && lat !== null && lon !== null
    })

    console.log("Valid Lotissements:", validLotissements)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
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
                                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white uppercase">Carte Interactive</h4>
                                </div>

                                <div className="p-6">
                                    <div className="mb-4 p-4 bg-white rounded-lg shadow">
                                        <h5 className="font-semibold mb-3">Filtres de la carte</h5>
                                        <div className="flex flex-wrap gap-4">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.showLotissements}
                                                    onChange={(e) => setFilters(prev => ({
                                                        ...prev,
                                                        showLotissements: e.target.checked
                                                    }))}
                                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span>Lotissements</span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.showLocalites}
                                                    onChange={(e) => setFilters(prev => ({
                                                        ...prev,
                                                        showLocalites: e.target.checked
                                                    }))}
                                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span>Localités</span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.showParcelles}
                                                    onChange={(e) => setFilters(prev => ({
                                                        ...prev,
                                                        showParcelles: e.target.checked
                                                    }))}
                                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span>Parcelles</span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.showZones}
                                                    onChange={(e) => setFilters(prev => ({
                                                        ...prev,
                                                        showZones: e.target.checked
                                                    }))}
                                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span>Zones de lotissement</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="h-[600px] w-full relative">
                                        {mapLoaded && (
                                            <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; '
                                                />
                                                <ZoomControl position="topright" />

                                                {/* Marqueurs des localités */}
                                                {filters.showLocalites && localites.map((localite) => (
                                                    <Marker
                                                        key={`localite-${localite.id}`}
                                                        position={[parseFloat(localite.latitude), parseFloat(localite.longitude)]}
                                                        icon={localiteIcon}
                                                    >
                                                        <Popup>
                                                            <div className="p-2">
                                                                <h3 className="font-bold text-blue-600">{localite.nom}</h3>
                                                                <p>Prix: {formatPrice(localite.prix)} </p>
                                                                <p>{localite.description}</p>
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                ))}

                                                {/* Lotissements */}
                                                {filters.showLotissements && validLotissements.map((lotissement) => (
                                                    <React.Fragment key={`lotissement-${lotissement.id}`}>
                                                        {/* Marqueur du lotissement */}
                                                        <Marker
                                                            position={[parseFloat(lotissement.latitude), parseFloat(lotissement.longitude)]}
                                                            icon={lotissementIcon}
                                                        >
                                                            <Popup>
                                                                <div>
                                                                    <h3 className="font-bold">{lotissement.nom}</h3>
                                                                    <p>Localisation: {lotissement.localisation}</p>
                                                                    <p>Statut: {lotissement.statut}</p>
                                                                </div>
                                                            </Popup>
                                                        </Marker>
                                                    </React.Fragment>
                                                ))}

                                                {/* Parcelles indépendantes */}
                                                {filters.showParcelles && parcelles.map((parcelle) => (
                                                    <CircleMarker
                                                        key={`parcelle-${parcelle.id}`}
                                                        center={[parseFloat(parcelle.latitude), parseFloat(parcelle.longitude)]}
                                                        radius={12}
                                                        fillColor={
                                                            parcelle.statut === 'DISPONIBLE' ? '#22c55e' : // vert
                                                                parcelle.statut === 'OCCUPE' ? '#ef4444' :     // rouge
                                                                    parcelle.statut === 'RESERVER' ? '#eab308' :   // jaune
                                                                        parcelle.statut === 'VENDU' ? '#6366f1' :      // violet
                                                                            'gray'                                         // gris par défaut
                                                        }
                                                        color="black"
                                                        weight={2}
                                                        opacity={1}
                                                        fillOpacity={0.8}
                                                    >
                                                        <Popup>
                                                            <div className="p-2">
                                                                <h3 className="font-bold">Parcelle {parcelle.numero}</h3>
                                                                <p>Surface: {parcelle.superface} m²</p>
                                                                <p>Statut: {parcelle.statut}</p>
                                                                <p>Lotissement: {parcelle.lotissement?.nom || "Non assigné"}</p>
                                                            </div>
                                                        </Popup>
                                                    </CircleMarker>
                                                ))}

                                                {/* Zones de lotissement */}
                                                {filters.showZones && validLotissements.map(lotissement => (
                                                    <React.Fragment key={`zone-${lotissement.id}`}>
                                                        <Polygon
                                                            positions={[[
                                                                [parseFloat(lotissement.latitude) + 0.001, parseFloat(lotissement.longitude) + 0.001],
                                                                [parseFloat(lotissement.latitude) + 0.001, parseFloat(lotissement.longitude) - 0.001],
                                                                [parseFloat(lotissement.latitude) - 0.001, parseFloat(lotissement.longitude) - 0.001],
                                                                [parseFloat(lotissement.latitude) - 0.001, parseFloat(lotissement.longitude) + 0.001],
                                                                [parseFloat(lotissement.latitude) + 0.001, parseFloat(lotissement.longitude) + 0.001]
                                                            ]]}
                                                            pathOptions={{
                                                                color: 'blue',
                                                                weight: 2,
                                                                fillColor: 'blue',
                                                                fillOpacity: 0.1
                                                            }}
                                                        >
                                                            <Popup>
                                                                <div>
                                                                    <h3 className="font-bold">{lotissement.nom}</h3>
                                                                    <p>Zone du lotissement</p>
                                                                </div>
                                                            </Popup>
                                                        </Polygon>
                                                    </React.Fragment>
                                                ))}
                                            </MapContainer>
                                        )}
                                        {/* Légende */}
                                        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
                                            <h5 className="font-semibold mb-2">Légende</h5>
                                            <div className="space-y-2">
                                                {filters.showLocalites && (
                                                    <div className="flex items-center gap-2">
                                                        <img src={markerIconPng} className="w-6 h-6" alt="Localité" />
                                                        <span>Localité</span>
                                                    </div>
                                                )}
                                                {filters.showLotissements && (
                                                    <div className="flex items-center gap-2">
                                                        <img src={markerShadowPng} className="w-6 h-6" alt="Lotissement" />
                                                        <span>Lotissement</span>
                                                    </div>
                                                )}
                                                {filters.showParcelles && (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                                            <span>Parcelle disponible</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                                            <span>Parcelle occupée</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                                                            <span>Parcelle réservée</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                                                            <span>Parcelle vendue</span>
                                                        </div>
                                                    </>
                                                )}
                                                {filters.showZones && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-4 border-2 border-blue-500 bg-blue-100/10"></div>
                                                        <span>Zone de lotissement</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-4 pt-2 border-t">
                                                <h6 className="font-semibold mb-1">Statistiques</h6>
                                                <p>Localités: {localites.length}</p>
                                                <p>Lotissements: {lotissements.length}</p>
                                                <p>Parcelles: {parcelles.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AdminMap

