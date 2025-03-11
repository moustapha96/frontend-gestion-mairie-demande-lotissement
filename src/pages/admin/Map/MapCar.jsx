"use client"
import { AdminBreadcrumb } from "@/components"
import React, { useState, useEffect } from "react"
import { useAuthContext } from "@/context"
import { Loader2 } from "lucide-react"
import "@/styles/map.css"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { formatPrice } from "@/utils/formatters"

const MapCar = ({ selectedItem, type = "lotissement" }) => {
    const { user } = useAuthContext()
    const [center, setCenter] = useState([14.6937, -17.4441])
    const [zoom] = useState(14)

    useEffect(() => {
        if (selectedItem?.latitude && selectedItem?.longitude) {
            setCenter([
                parseFloat(selectedItem.latitude),
                parseFloat(selectedItem.longitude)
            ])
        }
    }, [selectedItem])

    return (
        <>
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                    <h4 className="text-xl font-semibold text-gray-800 uppercase">Carte Interactive</h4>
                                </div>

                                <div className="p-6">
                                    <div className="h-[600px] w-full relative">
                                        <MapContainer
                                            center={[
                                                parseFloat(selectedItem?.latitude) || center[0],
                                                parseFloat(selectedItem?.longitude) || center[1]
                                            ]}
                                            zoom={zoom}
                                            style={{ height: "100%", width: "100%" }}
                                        >
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            />
                                            {selectedItem && (
                                                <CircleMarker
                                                    center={[
                                                        parseFloat(selectedItem.latitude),
                                                        parseFloat(selectedItem.longitude)
                                                    ]}
                                                    radius={8}
                                                    color="red"
                                                >
                                                    <Popup>
                                                        <div>
                                                            <h3 className="font-bold">{selectedItem.nom || selectedItem.numero || 'Sans titre'}</h3>
                                                            {type === "lotissement" && (
                                                                <>
                                                                    <p>Localisation: {selectedItem.localisation}</p>
                                                                    <p>Statut: {selectedItem.statut}</p>
                                                                    <p>Date de création: {new Date(selectedItem.dateCreation).toLocaleDateString()}</p>
                                                                </>
                                                            )}
                                                            {type === "localite" && (
                                                                <>
                                                                    <p>Prix:  {formatPrice(selectedItem.prix)} </p>
                                                                    <p>Description: {selectedItem.description}</p>
                                                                </>
                                                            )}
                                                            {type === "parcelle" && (
                                                                <>
                                                                    <p>Surface: {selectedItem.superface} m²</p>
                                                                    <p>Statut: {selectedItem.statut}</p>
                                                                </>
                                                            )}
                                                            <p>Coordonnées: {selectedItem.longitude}, {selectedItem.latitude}</p>
                                                        </div>
                                                    </Popup>
                                                </CircleMarker>
                                            )}
                                        </MapContainer>
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

export default MapCar
