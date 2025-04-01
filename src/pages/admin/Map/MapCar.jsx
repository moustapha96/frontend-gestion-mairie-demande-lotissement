

"use client"
import { useState, useEffect } from "react"
import { useAuthContext } from "@/context"
import { Loader2 } from "lucide-react"
import "@/styles/map.css"
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { formatPrice } from "@/utils/formatters"

// Composant pour mettre à jour la vue de la carte quand les coordonnées changent
const MapUpdater = ({ center, zoom }) => {
  const map = useMap()

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom)
    }
  }, [center, zoom, map])

  return null
}

const MapCar = ({ latitude, longitude, selectedItem, type = "lotissement" }) => {
  const { user } = useAuthContext()
  const [center, setCenter] = useState([14.655, -16.2313])
  const [zoom, setZoom] = useState(14)
  const [isMapReady, setIsMapReady] = useState(false)

  useEffect(() => {
    if (selectedItem && selectedItem.latitude && selectedItem.longitude) {
      const lat = Number.parseFloat(selectedItem.latitude)
      const lng = Number.parseFloat(selectedItem.longitude)

      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter([lat, lng])
        setZoom(15) // Zoom plus proche quand on a une localisation précise
      }
    } else if (latitude && longitude) {
      const lat = Number.parseFloat(latitude)
      const lng = Number.parseFloat(longitude)

      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter([lat, lng])
        setZoom(15)
      }
    }

    setIsMapReady(true)
  }, [selectedItem, latitude, longitude])

  if (!isMapReady) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement de la carte...</span>
      </div>
    )
  }

  return (
    <>
      <section>
        <div className="container">
          <div className="my-2 space-y-2">
            <div className="grid grid-cols-1">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  <h4 className="text-xl font-semibold text-gray-800 uppercase">Carte Interactive</h4>
                </div>

                <div className="p-2">
                  <div className="h-[600px] w-full relative">
                    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />

                      <MapUpdater center={center} zoom={zoom} />

                      {selectedItem && selectedItem.latitude && selectedItem.longitude && (
                        <CircleMarker
                          center={[Number.parseFloat(selectedItem.latitude), Number.parseFloat(selectedItem.longitude)]}
                          radius={10}
                          pathOptions={{
                            fillColor: "red",
                            color: "red",
                            fillOpacity: 0.7,
                          }}
                        >
                          <Popup>
                            <div>
                              <h3 className="font-bold">{selectedItem.nom || selectedItem.numero || "Sans titre"}</h3>
                              {type === "lotissement" && (
                                <>
                                  <p>Localisation: {selectedItem.localisation}</p>
                                  <p>Statut: {selectedItem.statut}</p>
                                  <p>Date de création: {new Date(selectedItem.dateCreation).toLocaleDateString()}</p>
                                </>
                              )}
                              {type === "localite" && (
                                <>
                                  <p>Prix: {formatPrice(selectedItem.prix)}</p>
                                  <p>Description: {selectedItem.description}</p>
                                </>
                              )}
                              {type === "parcelle" && (
                                <>
                                  <p>Surface: {selectedItem.superface} m²</p>
                                  <p>Statut: {selectedItem.statut}</p>
                                </>
                              )}
                              <p>
                                Coordonnées: {selectedItem.longitude}, {selectedItem.latitude}
                              </p>
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

