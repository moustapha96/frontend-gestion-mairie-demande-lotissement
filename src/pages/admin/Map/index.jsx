// "use client"
// import { AdminBreadcrumb } from "@/components"
// import React, { useState, useEffect } from "react"
// import { useAuthContext } from "@/context"
// import { getLotissements } from "@/services/lotissementService"

// import markerIconPng from "@/assets/pin.png"
// import markerShadowPng from "@/assets/location.png"

// import "@/styles/map.css"
// import { getLocalites } from "@/services/localiteService"
// import { getParcelles, getParcelleSimple } from "@/services/parcelleService"

// import { MapContainer, TileLayer, Marker, Popup, CircleMarker, ZoomControl, Polygon } from "react-leaflet"
// import "leaflet/dist/leaflet.css"
// import L from "leaflet"
// import { formatPrice } from "@/utils/formatters"
// import { Card, Typography, Space, Checkbox, Row, Col, Spin } from "antd";
// import { EnvironmentOutlined, AimOutlined, BorderOutlined, AppstoreOutlined } from "@ant-design/icons";

// const { Title, Text } = Typography;

// // Fix for default marker icons
// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIconPng,
//     iconUrl: markerIconPng,
//     shadowUrl: markerShadowPng,
// })

// // Ajoutez cette fonction avant le composant AdminMap
// const createBoundingBox = (parcelles) => {
//     if (!parcelles || parcelles.length === 0) return [];

//     // Trouver les coordonnées min et max
//     const lats = parcelles.map(p => parseFloat(p.latitude));
//     const lngs = parcelles.map(p => parseFloat(p.longitude));

//     const minLat = Math.min(...lats);
//     const maxLat = Math.max(...lats);
//     const minLng = Math.min(...lngs);
//     const maxLng = Math.max(...lngs);

//     // Ajouter une marge de 0.0001 degrés (environ 10 mètres)
//     const margin = 0.0001;

//     // Créer le polygone rectangulaire
//     return [
//         [minLat - margin, minLng - margin],
//         [maxLat + margin, minLng - margin],
//         [maxLat + margin, maxLng + margin],
//         [minLat - margin, maxLng + margin],
//         [minLat - margin, minLng - margin], // Fermer le polygone
//     ];
// };

// const AdminMap = () => {
//     const [lotissements, setLotissements] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [mapLoaded, setMapLoaded] = useState(false)
//     const [center] = useState([14.6937, -17.4441])
//     const [zoom] = useState(9)
//     const [localites, setLocalites] = useState([])
//     const [parcelles, setParcelles] = useState([])
//     const [filters, setFilters] = useState({
//         showLotissements: true,
//         showLocalites: false,
//         showParcelles: false,
//         showZones: false
//     });

//     // Définition des icônes personnalisées
//     const localiteIcon = new L.Icon({
//         iconUrl: markerIconPng,
//         iconSize: [35, 35],
//         iconAnchor: [17, 35],
//         popupAnchor: [0, -35]
//     })

//     const lotissementIcon = new L.Icon({
//         iconUrl: markerShadowPng,
//         iconSize: [30, 30],
//         iconAnchor: [15, 30],
//         popupAnchor: [0, -30]
//     })

//     useEffect(() => {
//         setTimeout(() => {
//             setMapLoaded(true)
//         }, 1000)
//     }, [])

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [lotissementsData, localitesData, parcellesData] = await Promise.all([
//                     getLotissements(),
//                     getLocalites(),
//                     getParcelleSimple()
//                 ]);
//                 // Séparer les parcelles des lotissements
//                 const lotissementsWithoutParcelles = lotissementsData.map(lot => ({
//                     ...lot,
//                     parcelles: []
//                 }));

//                 setLotissements(lotissementsWithoutParcelles);
//                 setLocalites(localitesData);
//                 setParcelles(parcellesData);
//             } catch (err) {
//                 console.error("Erreur:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (mapLoaded) {
//             fetchData();
//         }
//     }, [mapLoaded]);

//     const validLotissements = lotissements.filter((lot) => {
//         const lat = typeof lot.latitude === "string" ? Number.parseFloat(lot.latitude) : lot.latitude
//         const lon = typeof lot.longitude === "string" ? Number.parseFloat(lot.longitude) : lot.longitude
//         return !isNaN(lat) && !isNaN(lon) && lat !== null && lon !== null
//     })

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <Spin
//                     spinning={true}
//                     size="large"
//                     tip="Chargement de la carte..."
//                     fullscreen
//                 // nested
//                 />

//             </div>
//         )
//     }

//     const filterOptions = [
//         { label: 'Lotissements', value: 'showLotissements', icon: <AppstoreOutlined /> },
//         { label: 'Localités', value: 'showLocalites', icon: <EnvironmentOutlined /> },
//         { label: 'Parcelles', value: 'showParcelles', icon: <BorderOutlined /> },
//         // { label: 'Zones de lotissement', value: 'showZones', icon: <AimOutlined /> }
//     ];

//     return (
//         <>
//             <AdminBreadcrumb title="Carte des Lotissements" />
//             <section>
//                 <div className="container">
//                     <div className="my-6 space-y-6">
//                         <div className="grid grid-cols-1">
//                             <Card className="shadow-lg">
//                                 <Title level={4} className="mb-6">Carte Interactive</Title>

//                                 <Card className="mb-6" size="small">
//                                     <Title level={5} className="mb-4">Filtres de la carte</Title>
//                                     <Row gutter={[16, 16]}>
//                                         {filterOptions.map(option => (
//                                             <Col key={option.value} xs={24} sm={12} md={6}>
//                                                 <Checkbox
//                                                     checked={filters[option.value]}
//                                                     onChange={(e) => setFilters(prev => ({
//                                                         ...prev,
//                                                         [option.value]: e.target.checked
//                                                     }))}
//                                                 >
//                                                     <Space>
//                                                         {option.icon}
//                                                         <Text>{option.label}</Text>
//                                                     </Space>
//                                                 </Checkbox>
//                                             </Col>
//                                         ))}
//                                     </Row>
//                                 </Card>

//                                 <div className="h-[600px] rounded-lg overflow-hidden">
//                                     <MapContainer
//                                         center={center}
//                                         zoom={zoom}
//                                         className="h-full w-full"
//                                         zoomControl={false}
//                                     >
//                                         <TileLayer
//                                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                                             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                                         />
//                                         <ZoomControl position="topright" />

//                                         {/* Marqueurs des localités */}
//                                         {filters.showLocalites && localites.map((localite) => (
//                                             <Marker
//                                                 key={`localite-${localite.id}`}
//                                                 position={[
//                                                     Number.parseFloat(localite.latitude),
//                                                     Number.parseFloat(localite.longitude),
//                                                 ]}
//                                                 icon={localiteIcon}
//                                             >
//                                                 <Popup>
//                                                     <div className="p-2">
//                                                         <Text strong>{localite.nom}</Text>
//                                                         <div className="mt-2">
//                                                             <Text type="secondary">Description: </Text>
//                                                             <Text>{localite.description}</Text>
//                                                         </div>
//                                                         <div className="mt-1">
//                                                             <Text type="secondary">Prix: </Text>
//                                                             <Text>{formatPrice(localite.prix)}</Text>
//                                                         </div>
//                                                     </div>
//                                                 </Popup>
//                                             </Marker>
//                                         ))}

//                                         {/* Lotissements */}
//                                         {filters.showLotissements && validLotissements.map((lotissement) => (
//                                             <React.Fragment key={`lotissement-${lotissement.id}`}>
//                                                 {/* Marqueur du lotissement */}
//                                                 <Marker
//                                                     position={[
//                                                         typeof lotissement.latitude === "string"
//                                                             ? Number.parseFloat(lotissement.latitude)
//                                                             : lotissement.latitude,
//                                                         typeof lotissement.longitude === "string"
//                                                             ? Number.parseFloat(lotissement.longitude)
//                                                             : lotissement.longitude,
//                                                     ]}
//                                                     icon={lotissementIcon}
//                                                 >
//                                                     <Popup>
//                                                         <div>
//                                                             <Text strong>{lotissement.nom}</Text>
//                                                             <div className="mt-2">
//                                                                 <Text type="secondary">Localisation: </Text>
//                                                                 <Text>{lotissement.localisation}</Text>
//                                                             </div>
//                                                             <div className="mt-1">
//                                                                 <Text type="secondary">Statut: </Text>
//                                                                 <Text>{lotissement.statut}</Text>
//                                                             </div>
//                                                         </div>
//                                                     </Popup>
//                                                 </Marker>
//                                             </React.Fragment>
//                                         ))}

//                                         {/* Parcelles indépendantes */}
//                                         {filters.showParcelles && parcelles.map((parcelle) => (
//                                             <CircleMarker
//                                                 key={`parcelle-${parcelle.id}`}
//                                                 center={[
//                                                     Number.parseFloat(parcelle.latitude),
//                                                     Number.parseFloat(parcelle.longitude),
//                                                 ]}
//                                                 radius={8}
//                                                 fillColor="#FF4136"
//                                                 color="#85144b"
//                                                 weight={1}
//                                                 opacity={0.8}
//                                                 fillOpacity={0.6}
//                                             >
//                                                 <Popup>
//                                                     <div className="p-2">
//                                                         <Text strong>Parcelle {parcelle.numero}</Text>
//                                                         <div className="mt-2">
//                                                             <Text type="secondary">Superficie: </Text>
//                                                             <Text>{parcelle.superficie} m²</Text>
//                                                         </div>
//                                                         <div className="mt-1">
//                                                             <Text type="secondary">Prix: </Text>
//                                                             <Text>{formatPrice(parcelle.prix)}</Text>
//                                                         </div>
//                                                     </div>
//                                                 </Popup>
//                                             </CircleMarker>
//                                         ))}

//                                         {/* Zones de lotissement */}
//                                         {filters.showZones && validLotissements.map((lotissement) => {
//                                             const boundingBox = createBoundingBox(lotissement.parcelles);
//                                             return boundingBox.length > 0 ? (
//                                                 <Polygon
//                                                     key={`zone-${lotissement.id}`}
//                                                     positions={boundingBox}
//                                                     pathOptions={{
//                                                         color: '#2ECC40',
//                                                         fillColor: '#01FF70',
//                                                         fillOpacity: 0.2,
//                                                         weight: 2
//                                                     }}
//                                                 >
//                                                     <Popup>
//                                                         <div className="p-2">
//                                                             <Text strong>Zone: {lotissement.nom}</Text>
//                                                             <div className="mt-2">
//                                                                 <Text type="secondary">Nombre de parcelles: </Text>
//                                                                 <Text>{lotissement.parcelles.length}</Text>
//                                                             </div>
//                                                         </div>
//                                                     </Popup>
//                                                 </Polygon>
//                                             ) : null;
//                                         })}
//                                     </MapContainer>
//                                 </div>
//                             </Card>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//         </>
//     )
// }

// export default AdminMap

"use client";
import { AdminBreadcrumb } from "@/components";
import React, { useState, useEffect, useMemo } from "react";
import { getLotissements } from "@/services/lotissementService";
import markerIconPng from "@/assets/pin.png";
import markerShadowPng from "@/assets/location.png";
import "@/styles/map.css";
import { getLocalites } from "@/services/localiteService";
import { getParcelleSimple } from "@/services/parcelleService";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, ZoomControl, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { formatPrice } from "@/utils/formatters";
import { Card, Typography, Space, Checkbox, Row, Col, Spin } from "antd";
import { EnvironmentOutlined, BorderOutlined, AppstoreOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconPng,
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

// ---------- Helpers ----------
const toNum = (v) => (typeof v === "string" ? Number.parseFloat(v) : v);
const isValidCoord = (lat, lng) => {
  const la = toNum(lat), ln = toNum(lng);
  return typeof la === "number" && typeof ln === "number" && !Number.isNaN(la) && !Number.isNaN(ln);
};

// Crée un rectangle englobant basé sur des parcelles (en ne gardant que celles avec coords valides)
const createBoundingBox = (parcelles) => {
  const pts = (parcelles || [])
    .map((p) => ({ lat: toNum(p.latitude), lng: toNum(p.longitude) }))
    .filter((p) => isValidCoord(p.lat, p.lng));

  if (pts.length === 0) return [];

  const lats = pts.map((p) => p.lat);
  const lngs = pts.map((p) => p.lng);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const margin = 0.0001;
  return [
    [minLat - margin, minLng - margin],
    [maxLat + margin, minLng - margin],
    [maxLat + margin, maxLng + margin],
    [minLat - margin, maxLng + margin],
    [minLat - margin, minLng - margin],
  ];
};

const AdminMap = () => {
  const [lotissements, setLotissements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [center] = useState([14.6937, -17.4441]);
  const [zoom] = useState(9);
  const [localites, setLocalites] = useState([]);
  const [parcelles, setParcelles] = useState([]);
  const [filters, setFilters] = useState({
    showLotissements: true,
    showLocalites: false,
    showParcelles: false,
    showZones: false,
  });

  // Icônes
  const localiteIcon = new L.Icon({
    iconUrl: markerIconPng,
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  });

  const lotissementIcon = new L.Icon({
    iconUrl: markerShadowPng,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  useEffect(() => {
    const t = setTimeout(() => setMapLoaded(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lotissementsData, localitesData, parcellesData] = await Promise.all([
          getLotissements(),
          getLocalites(),
          getParcelleSimple(),
        ]);

        // On retire les parcelles imbriquées côté lotissement (tu as des parcelles indépendantes)
        const lotissementsSansParcelles = (lotissementsData || []).map((lot) => ({
          ...lot,
          parcelles: Array.isArray(lot.parcelles) ? lot.parcelles : [],
        }));

        setLotissements(lotissementsSansParcelles);
        setLocalites(localitesData || []);
        setParcelles(parcellesData || []);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    if (mapLoaded) fetchData();
  }, [mapLoaded]);

  // ---------- Listes filtrées avec coordonnées valides ----------
  const validLotissements = useMemo(
    () =>
      (lotissements || []).filter((l) => isValidCoord(l.latitude, l.longitude)),
    [lotissements]
  );

  const validLocalites = useMemo(
    () =>
      (localites || []).filter((loc) => isValidCoord(loc.latitude, loc.longitude)),
    [localites]
  );

  const validParcelles = useMemo(
    () =>
      (parcelles || []).filter((p) => isValidCoord(p.latitude, p.longitude)),
    [parcelles]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin spinning size="large" tip="Chargement de la carte..." fullscreen />
      </div>
    );
  }

  const filterOptions = [
    { label: "Lotissements", value: "showLotissements", icon: <AppstoreOutlined /> },
    { label: "Localités", value: "showLocalites", icon: <EnvironmentOutlined /> },
    { label: "Parcelles", value: "showParcelles", icon: <BorderOutlined /> },
    // { label: "Zones de lotissement", value: "showZones", icon: <AimOutlined /> },
  ];

  return (
    <>
      <AdminBreadcrumb title="Carte des Lotissements" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <Card className="shadow-lg">
                <Title level={4} className="mb-6">Carte Interactive</Title>

                <Card className="mb-6" size="small">
                  <Title level={5} className="mb-4">Filtres de la carte</Title>
                  <Row gutter={[16, 16]}>
                    {filterOptions.map((option) => (
                      <Col key={option.value} xs={24} sm={12} md={6}>
                        <Checkbox
                          checked={filters[option.value]}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              [option.value]: e.target.checked,
                            }))
                          }
                        >
                          <Space>
                            {option.icon}
                            <Text>{option.label}</Text>
                          </Space>
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Card>

                <div className="h-[600px] rounded-lg overflow-hidden">
                  <MapContainer center={center} zoom={zoom} className="h-full w-full" zoomControl={false}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <ZoomControl position="topright" />

                    {/* Localités (valides uniquement) */}
                    {filters.showLocalites &&
                      validLocalites.map((localite) => (
                        <Marker
                          key={`localite-${localite.id}`}
                          position={[toNum(localite.latitude), toNum(localite.longitude)]}
                          icon={localiteIcon}
                        >
                          <Popup>
                            <div className="p-2">
                              <Text strong>{localite.nom}</Text>
                              <div className="mt-2">
                                <Text type="secondary">Description: </Text>
                                <Text>{localite.description}</Text>
                              </div>
                              <div className="mt-1">
                                <Text type="secondary">Prix: </Text>
                                <Text>{formatPrice(localite.prix)}</Text>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}

                    {/* Lotissements (valides uniquement) */}
                    {filters.showLotissements &&
                      validLotissements.map((lotissement) => (
                        <Marker
                          key={`lotissement-${lotissement.id}`}
                          position={[toNum(lotissement.latitude), toNum(lotissement.longitude)]}
                          icon={lotissementIcon}
                        >
                          <Popup>
                            <div>
                              <Text strong>{lotissement.nom}</Text>
                              <div className="mt-2">
                                <Text type="secondary">Localisation: </Text>
                                <Text>{lotissement.localisation}</Text>
                              </div>
                              <div className="mt-1">
                                <Text type="secondary">Statut: </Text>
                                <Text>{lotissement.statut}</Text>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}

                    {/* Parcelles (valides uniquement) */}
                    {filters.showParcelles &&
                      validParcelles.map((parcelle) => (
                        <CircleMarker
                          key={`parcelle-${parcelle.id}`}
                          center={[toNum(parcelle.latitude), toNum(parcelle.longitude)]}
                          radius={8}
                          fillColor="#FF4136"
                          color="#85144b"
                          weight={1}
                          opacity={0.8}
                          fillOpacity={0.6}
                        >
                          <Popup>
                            <div className="p-2">
                              <Text strong>Parcelle {parcelle.numero}</Text>
                              <div className="mt-2">
                                <Text type="secondary">Superficie: </Text>
                                <Text>{parcelle.superficie} m²</Text>
                              </div>
                              <div className="mt-1">
                                <Text type="secondary">Prix: </Text>
                                <Text>{formatPrice(parcelle.prix)}</Text>
                              </div>
                            </div>
                          </Popup>
                        </CircleMarker>
                      ))}

                    {/* Zones de lotissement (calculées sur parcelles valides uniquement) */}
                    {filters.showZones &&
                      validLotissements.map((lotissement) => {
                        const bbox = createBoundingBox(lotissement.parcelles);
                        return bbox.length ? (
                          <Polygon
                            key={`zone-${lotissement.id}`}
                            positions={bbox}
                            pathOptions={{
                              color: "#2ECC40",
                              fillColor: "#01FF70",
                              fillOpacity: 0.2,
                              weight: 2,
                            }}
                          >
                            <Popup>
                              <div className="p-2">
                                <Text strong>Zone: {lotissement.nom}</Text>
                                <div className="mt-2">
                                  <Text type="secondary">Nombre de parcelles: </Text>
                                  <Text>{(lotissement.parcelles || []).filter((p) => isValidCoord(p.latitude, p.longitude)).length}</Text>
                                </div>
                              </div>
                            </Popup>
                          </Polygon>
                        ) : null;
                      })}
                  </MapContainer>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminMap;
