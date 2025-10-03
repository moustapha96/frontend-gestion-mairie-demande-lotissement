

// "use client"
// import { useState, useEffect } from "react"
// import { useAuthContext } from "@/context"
// import { Loader2 } from "lucide-react"
// import "@/styles/map.css"
// import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet"
// import "leaflet/dist/leaflet.css"
// import { formatPrice } from "@/utils/formatters"

// // Composant pour mettre à jour la vue de la carte quand les coordonnées changent
// const MapUpdater = ({ center, zoom }) => {
//   const map = useMap()

//   useEffect(() => {
//     if (center && center[0] && center[1]) {
//       map.setView(center, zoom)
//     }
//   }, [center, zoom, map])

//   return null
// }

// const MapCar = ({ latitude, longitude, selectedItem, type = "lotissement" }) => {
//   const { user } = useAuthContext()
//   const [center, setCenter] = useState([14.655, -16.2313])
//   const [zoom, setZoom] = useState(14)
//   const [isMapReady, setIsMapReady] = useState(false)

//   useEffect(() => {
//     if (selectedItem && selectedItem.latitude && selectedItem.longitude) {
//       const lat = Number.parseFloat(selectedItem.latitude)
//       const lng = Number.parseFloat(selectedItem.longitude)

//       if (!isNaN(lat) && !isNaN(lng)) {
//         setCenter([lat, lng])
//         setZoom(15) // Zoom plus proche quand on a une localisation précise
//       }
//     } else if (latitude && longitude) {
//       const lat = Number.parseFloat(latitude)
//       const lng = Number.parseFloat(longitude)

//       if (!isNaN(lat) && !isNaN(lng)) {
//         setCenter([lat, lng])
//         setZoom(15)
//       }
//     }

//     setIsMapReady(true)
//   }, [selectedItem, latitude, longitude])

//   if (!isMapReady) {
//     return (
//       <div className="h-[600px] w-full flex items-center justify-center bg-gray-100">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         <span className="ml-2">Chargement de la carte...</span>
//       </div>
//     )
//   }

//   return (
//     <>
//       <section>
//         <div className="container">
//           <div className="my-2 space-y-2">
//             <div className="grid grid-cols-1">
//               <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//                 <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//                   <h4 className="text-xl font-semibold text-gray-800 uppercase">Carte Interactive</h4>
//                 </div>

//                 <div className="p-2">
//                   <div className="h-[600px] w-full relative">
//                     <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
//                       <TileLayer
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//                       />

//                       <MapUpdater center={center} zoom={zoom} />

//                       {selectedItem && selectedItem.latitude && selectedItem.longitude && (
//                         <CircleMarker
//                           center={[Number.parseFloat(selectedItem.latitude), Number.parseFloat(selectedItem.longitude)]}
//                           radius={10}
//                           pathOptions={{
//                             fillColor: "red",
//                             color: "red",
//                             fillOpacity: 0.7,
//                           }}
//                         >
//                           <Popup>
//                             <div>
//                               <h3 className="font-bold">{selectedItem.nom || selectedItem.numero || "Sans titre"}</h3>
//                               {type === "lotissement" && (
//                                 <>
//                                   <p>Localisation: {selectedItem.localisation}</p>
//                                   <p>Statut: {selectedItem.statut}</p>
//                                   <p>Date de création: {new Date(selectedItem.dateCreation).toLocaleDateString()}</p>
//                                 </>
//                               )}
//                               {type === "localite" && (
//                                 <>
//                                   <p>Prix: {formatPrice(selectedItem.prix)}</p>
//                                   <p>Description: {selectedItem.description}</p>
//                                 </>
//                               )}
//                               {type === "parcelle" && (
//                                 <>
//                                   <p>Surface: {selectedItem.superface} m²</p>
//                                   <p>Statut: {selectedItem.statut}</p>
//                                 </>
//                               )}
//                               <p>
//                                 Coordonnées: {selectedItem.longitude}, {selectedItem.latitude}
//                               </p>
//                             </div>
//                           </Popup>
//                         </CircleMarker>
//                       )}
//                     </MapContainer>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   )
// }

// export default MapCar


"use client"
import { useState, useEffect, useMemo } from "react"
import { Loader2 } from "lucide-react"
import "@/styles/map.css"
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { formatPrice } from "@/utils/formatters"

// ---------- Helpers ----------
const toNum = (v) => (typeof v === "string" ? Number.parseFloat(v) : v);
const isValidCoord = (lat, lng) => {
  const la = toNum(lat), ln = toNum(lng);
  return typeof la === "number" && typeof ln === "number" && !Number.isNaN(la) && !Number.isNaN(ln);
};

// Met à jour la vue quand center/zoom changent
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (Array.isArray(center) && center.length === 2 && isValidCoord(center[0], center[1])) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const MapCar = ({ latitude, longitude, selectedItem, type = "lotissement" }) => {
  // Défaut Dakar centre-ish
  const DEFAULT_CENTER = [14.655, -16.2313];
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(14);
  const [isMapReady, setIsMapReady] = useState(false);

  // Coordonnées calculées (priorité à selectedItem)
  const markerCoord = useMemo(() => {
    const fromSelected =
      selectedItem && isValidCoord(selectedItem?.latitude, selectedItem?.longitude)
        ? [toNum(selectedItem.latitude), toNum(selectedItem.longitude)]
        : null;

    if (fromSelected) return fromSelected;

    const fromProps = isValidCoord(latitude, longitude)
      ? [toNum(latitude), toNum(longitude)]
      : null;

    return fromProps;
  }, [selectedItem, latitude, longitude]);

  useEffect(() => {
    // Centre carte si on a un point valide
    if (markerCoord) {
      setCenter(markerCoord);
      setZoom(15);
    } else {
      setCenter(DEFAULT_CENTER);
      setZoom(12);
    }
    setIsMapReady(true);
  }, [markerCoord]);

  if (!isMapReady) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement de la carte...</span>
      </div>
    );
  }

  const hasValidMarker = Array.isArray(markerCoord) && markerCoord.length === 2 && isValidCoord(markerCoord[0], markerCoord[1]);

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

                      {/* Marker uniquement si coordonnées valides */}
                      {hasValidMarker ? (
                        <CircleMarker
                          center={markerCoord}
                          radius={10}
                          pathOptions={{ fillColor: "red", color: "red", fillOpacity: 0.7 }}
                        >
                          <Popup>
                            <div>
                              <h3 className="font-bold">
                                {selectedItem?.nom || selectedItem?.numero || "Sans titre"}
                              </h3>

                              {type === "lotissement" && selectedItem && (
                                <>
                                  <p>Localisation: {selectedItem.localisation || "—"}</p>
                                  <p>Statut: {selectedItem.statut || "—"}</p>
                                  <p>
                                    Date de création:{" "}
                                    {selectedItem.dateCreation
                                      ? new Date(selectedItem.dateCreation).toLocaleDateString()
                                      : "—"}
                                  </p>
                                </>
                              )}

                              {type === "localite" && selectedItem && (
                                <>
                                  <p>Prix: {formatPrice(selectedItem.prix)}</p>
                                  <p>Description: {selectedItem.description || "—"}</p>
                                </>
                              )}

                              {type === "parcelle" && selectedItem && (
                                <>
                                  <p>Surface: {selectedItem.superficie ?? selectedItem.superface ?? "—"} m²</p>
                                  <p>Statut: {selectedItem.statut || "—"}</p>
                                </>
                              )}

                              <p>
                                Coordonnées: {markerCoord[1]}, {markerCoord[0]}
                              </p>
                            </div>
                          </Popup>
                        </CircleMarker>
                      ) : (
                        // État vide si aucune coord valide
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-white/90 rounded-md px-4 py-3 shadow text-center">
                            <p className="font-semibold text-gray-700">Aucune coordonnée valide</p>
                            <p className="text-gray-500 text-sm">
                              Cet élément ne possède pas de latitude/longitude valides.
                            </p>
                          </div>
                        </div>
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
  );
};

export default MapCar
